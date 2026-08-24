/*
 * PacketSimulator - Arduino Uno telemetry packet generator
 *
 * Emits TelemetryPacket_t (95 bytes, packed, little-endian) at 10 Hz over the
 * hardware UART so the ground station UI can be tested without the real flight
 * controller. Also accepts the ground station's 5-byte command frames.
 *
 * Wiring (USB-to-UART TTL adapter):
 *   adapter TX  -> Uno pin 0   (Uno RX)
 *   adapter RX  -> Uno pin 1   (Uno TX)
 *   adapter GND -> Uno GND     (required, common ground)
 *
 * The adapter must be 5 V logic. With a 3.3 V adapter, put a divider on the
 * Uno pin 1 -> adapter RX line (e.g. 1k series + 2k to GND) or the adapter
 * input may be damaged.
 *
 * Pins 0 and 1 are shared with the Uno's own USB interface: DISCONNECT THE
 * ADAPTER BEFORE UPLOADING or the upload will fail, and do not open the Serial
 * Monitor while the adapter is attached.
 */

const long TELEMETRY_BAUD = 115200;
const uint16_t PACKET_INTERVAL_MS = 100;  // 10 Hz

const uint16_t SYNC_WORD = 0xCAFE;
const uint8_t SYNC_END = 0xBE;

// flight states, must match the ground station enum
enum FlightState : uint8_t {
  STATE_IDLE = 0,
  STATE_CALIBRATION = 1,
  STATE_PRELAUNCH = 2,
  STATE_BURN = 3,
  STATE_PASSIVE_BURNOUT = 4,
  STATE_ACTIVE_BURNOUT = 5,
  STATE_APOGEE = 6,
  STATE_PARACHUTE = 7,
  STATE_LANDED = 8,
  STATE_GROUND_ABORT = 9,
  STATE_DESCENT_ABORT = 10
};

const uint8_t RELAY_DROGUE = 0x01;
const uint8_t RELAY_PARACHUTE = 0x02;

// inbound command frame: FE CA <cmd> <payload length> BE
const uint8_t CMD_RESET = 0x01;
const uint8_t CMD_GROUND_ABORT = 0x02;
const uint8_t CMD_CALIBRATION = 0x03;
const uint8_t CMD_DROGUE = 0x04;

const uint8_t CMD_NONE = 0x00;

// echoed back in every packet, persists until the next command arrives
uint8_t lastCommand = CMD_NONE;

struct __attribute__((packed)) TelemetryPacket_t {
  uint16_t sync;
  uint32_t tick;
  int32_t accelX;
  int32_t accelY;
  int32_t accelZ;
  int32_t gyroX;
  int32_t gyroY;
  int32_t gyroZ;
  int32_t magX;
  int32_t magY;
  int32_t magZ;
  int32_t pressurePa;
  int32_t temperatureC;
  int32_t latitude;
  int32_t longitude;
  int32_t gpsAltitude;
  uint8_t satellites;
  int32_t barometricAltitude;
  int32_t barometricVelocity;
  int32_t velX;
  int32_t velY;
  int32_t velZ;
  uint32_t flags;
  int32_t batteryVoltage;
  uint8_t state;
  uint8_t relayState;
  uint8_t lastCommand;
  uint8_t syncEnd;
};

static_assert(sizeof(TelemetryPacket_t) == 95, "packet must be exactly 95 bytes");

// simulated flight state
const float PAD_LATITUDE = 37.3852298f;
const float PAD_LONGITUDE = -6.0154051f;
const float PAD_ELEVATION_M = 120.0f;  // pad height above sea level

const float DT = PACKET_INTERVAL_MS / 1000.0f;
const float GRAVITY = 9.81f;
const float BURN_ACCEL = 60.0f;      // m/s^2 net thrust acceleration
const float BURN_DURATION_S = 4.0f;
const float DESCENT_RATE = -8.0f;    // m/s under the main chute

uint8_t flightState = STATE_IDLE;
float stateElapsed = 0.0f;   // seconds in the current state
float altitude = 0.0f;       // metres above ground level
float velocity = 0.0f;       // m/s, positive up
float verticalAccel = 0.0f;  // m/s^2, sensed on the body Z axis
uint8_t relayState = 0;

// while false the profile holds in the current state instead of advancing on
// its own, so a RESET or ABORT sticks until the operator sends CALIBRATION
bool autoSequence = true;

uint32_t nextPacketAt = 0;

// random noise helper: returns a float in [-magnitude, magnitude]
float noise(float magnitude) {
  return (random(-1000, 1001) / 1000.0f) * magnitude;
}

// round-half-away-from-zero, then scale by 100 for the wire format
int32_t scaled(float value) {
  return (int32_t)(value * 100.0f + (value >= 0 ? 0.5f : -0.5f));
}

void enterState(uint8_t next) {
  flightState = next;
  stateElapsed = 0.0f;
}

// park the vehicle on the pad, motionless and safed
void resetToPad(uint8_t state) {
  altitude = 0.0f;
  velocity = 0.0f;
  verticalAccel = GRAVITY;
  relayState = 0;
  autoSequence = false;  // hold here until told otherwise
  enterState(state);
}

void handleCommand(uint8_t command) {
  switch (command) {
    case CMD_RESET:
      resetToPad(STATE_IDLE);
      break;

    case CMD_GROUND_ABORT:
      resetToPad(STATE_GROUND_ABORT);
      break;

    case CMD_CALIBRATION:
      // the ground station only offers this on the pad, mirror that here
      if (flightState == STATE_IDLE) {
        autoSequence = true;
        enterState(STATE_CALIBRATION);
      }
      break;

    case CMD_DROGUE:
      // manual pyro fire, accepted from any state with no checks: latch the
      // relay bit and jump straight to apogee so the descent profile runs
      relayState |= RELAY_DROGUE;
      autoSequence = true;
      enterState(STATE_APOGEE);
      break;

    default:
      // unknown byte, not a command: leave the echo untouched
      return;
  }

  lastCommand = command;
}

// Scans the incoming byte stream for FE CA <cmd> <len> BE. Anything that does
// not complete a valid frame is dropped and the scan restarts, same as the
// ground station does with telemetry. The hardware UART buffers bytes in its
// RX interrupt, so a frame that arrives mid-transmit is still there after.
void pollCommands() {
  static uint8_t field = 0;  // how many bytes of the current frame are in hand
  static uint8_t command = 0;

  while (Serial.available() > 0) {
    const uint8_t byteIn = (uint8_t)Serial.read();

    switch (field) {
      case 0:
        field = (byteIn == 0xFE) ? 1 : 0;
        break;

      case 1:
        // a second FE could be the real start of a frame, so stay at field 1
        if (byteIn == 0xCA) field = 2;
        else field = (byteIn == 0xFE) ? 1 : 0;
        break;

      case 2:
        command = byteIn;
        field = 3;
        break;

      case 3:
        // only zero-length payloads exist today
        field = (byteIn == 0x00) ? 4 : 0;
        break;

      case 4:
        if (byteIn == SYNC_END) handleCommand(command);
        field = 0;
        break;
    }
  }
}

void stepFlight() {
  stateElapsed += DT;

  switch (flightState) {
    case STATE_IDLE:
      verticalAccel = GRAVITY;
      if (autoSequence && stateElapsed >= 5.0f) enterState(STATE_CALIBRATION);
      break;

    case STATE_GROUND_ABORT:
      // aborted on the pad, nothing moves until a RESET arrives
      verticalAccel = GRAVITY;
      break;

    case STATE_CALIBRATION:
      verticalAccel = GRAVITY;
      if (stateElapsed >= 5.0f) enterState(STATE_PRELAUNCH);
      break;

    case STATE_PRELAUNCH:
      verticalAccel = GRAVITY;
      if (stateElapsed >= 5.0f) enterState(STATE_BURN);
      break;

    case STATE_BURN:
      verticalAccel = GRAVITY + BURN_ACCEL;
      velocity += BURN_ACCEL * DT;
      altitude += velocity * DT;
      if (stateElapsed >= BURN_DURATION_S) enterState(STATE_PASSIVE_BURNOUT);
      break;

    case STATE_PASSIVE_BURNOUT:
      verticalAccel = 0.0f;  // free fall, accelerometer reads ~0
      velocity -= GRAVITY * DT;
      altitude += velocity * DT;
      if (velocity <= 0.0f) enterState(STATE_APOGEE);
      break;

    case STATE_APOGEE:
      verticalAccel = 0.0f;
      velocity -= GRAVITY * DT;
      altitude += velocity * DT;
      // a drogue command fired on the pad lands here with no altitude to lose
      if (altitude < 0.0f) altitude = 0.0f;
      relayState |= RELAY_DROGUE;
      if (stateElapsed >= 1.0f) {
        relayState |= RELAY_PARACHUTE;
        enterState(STATE_PARACHUTE);
      }
      break;

    case STATE_PARACHUTE:
      // chute pulls the descent toward a constant terminal velocity
      velocity += (DESCENT_RATE - velocity) * 0.35f;
      altitude += velocity * DT;
      verticalAccel = GRAVITY;
      if (altitude <= 0.0f) {
        altitude = 0.0f;
        velocity = 0.0f;
        enterState(STATE_LANDED);
      }
      break;

    case STATE_LANDED:
      verticalAccel = GRAVITY;
      relayState = 0;  // safed on the ground
      if (stateElapsed >= 8.0f) {
        // restart the profile so the UI keeps getting a full flight
        altitude = 0.0f;
        velocity = 0.0f;
        enterState(STATE_IDLE);
      }
      break;
  }
}

void buildPacket(TelemetryPacket_t &packet) {
  const float asl = altitude + PAD_ELEVATION_M;

  // barometric formula, altitude above sea level -> pressure in pascals
  const float pressurePa = 101325.0f * pow(1.0f - 2.25577e-5f * asl, 5.25588f);

  // rockets tumble a little more once the motor is out
  const float spin = (flightState >= STATE_PASSIVE_BURNOUT) ? 60.0f : 5.0f;

  const float seconds = millis() / 1000.0f;

  packet.sync = SYNC_WORD;
  packet.tick = millis();

  packet.accelX = scaled(noise(1.5f));
  packet.accelY = scaled(noise(1.5f));
  packet.accelZ = scaled(verticalAccel + noise(0.4f));

  packet.gyroX = scaled(noise(spin));
  packet.gyroY = scaled(noise(spin));
  packet.gyroZ = scaled(noise(spin));

  packet.magX = scaled(320.0f + noise(15.0f));
  packet.magY = scaled(-140.0f + noise(15.0f));
  packet.magZ = scaled(410.0f + noise(15.0f));

  packet.pressurePa = scaled(pressurePa);
  packet.temperatureC = scaled(25.0f - (asl * 0.0065f) + noise(0.3f));

  // drift the ground track a little so the map has something to draw
  packet.latitude = (int32_t)((PAD_LATITUDE + 0.0004f * sin(seconds / 6.0f)) * 10000000.0f);
  packet.longitude = (int32_t)((PAD_LONGITUDE + 0.0004f * cos(seconds / 6.0f)) * 10000000.0f);

  // GPS altitude is above sea level and much noisier than the barometer
  packet.gpsAltitude = scaled(asl + noise(12.0f));
  packet.satellites = (uint8_t)random(7, 13);

  // barometric altitude is above ground level, filtered
  packet.barometricAltitude = scaled(altitude + noise(0.5f));
  packet.barometricVelocity = scaled(velocity + noise(0.3f));

  packet.velX = 0;
  packet.velY = 0;
  packet.velZ = 0;

  packet.flags = 0;
  packet.batteryVoltage = scaled(12.6f - (seconds * 0.002f) + noise(0.03f));

  packet.state = flightState;
  packet.relayState = relayState;
  packet.lastCommand = lastCommand;
  packet.syncEnd = SYNC_END;
}

void setup() {
  randomSeed(analogRead(A0));
  Serial.begin(TELEMETRY_BAUD);
  nextPacketAt = millis();
}

void loop() {
  pollCommands();

  const uint32_t now = millis();

  // unsigned subtraction, so this stays correct across the millis() rollover
  if ((int32_t)(now - nextPacketAt) < 0) {
    return;
  }
  nextPacketAt += PACKET_INTERVAL_MS;

  stepFlight();

  TelemetryPacket_t packet;
  buildPacket(packet);

  Serial.write((const uint8_t *)&packet, sizeof(packet));
}
