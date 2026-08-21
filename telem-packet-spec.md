# Ground Station Serial Protocol Specification

## Overview

The flight controller sends telemetry packets over UART at **115200 baud, 8N1**. Each packet is a packed C struct (`TelemetryPacket_t`) sent as raw little-endian bytes. No additional protocol wrapping — the struct IS the packet.

**Packet size:** 94 bytes  
**Byte order:** Little-endian  
**Sync word:** `0xCAFE` (on wire: `0xFE` then `0xCA`)  
**Footer byte:** `0xBE` at offset 93  
**Estimated rate:** ~10 Hz (decimated from 100 Hz main loop)

## Packet Layout

All `int32 (×100)` fields are float values multiplied by 100 before sending. Divide by 100 on receive to recover 2 decimal places. Latitude and Longitude are NOT ×100 — they use their own scaling (×10^7).

| Offset | Size | Type   | Field          | Unit / Notes                        |
|--------|------|--------|----------------|-------------------------------------|
| 0      | 2    | uint16 | Sync           | Always `0xCAFE`                     |
| 2      | 4    | uint32 | Tick           | FreeRTOS tick count (ms)            |
| 6      | 4    | int32  | AccelX         | m/s² × 100                         |
| 10     | 4    | int32  | AccelY         | m/s² × 100                         |
| 14     | 4    | int32  | AccelZ         | m/s² × 100                         |
| 18     | 4    | int32  | GyroX          | dps × 100, bias-corrected          |
| 22     | 4    | int32  | GyroY          | dps × 100                          |
| 26     | 4    | int32  | GyroZ          | dps × 100                          |
| 30     | 4    | int32  | MagX           | milligauss × 100                   |
| 34     | 4    | int32  | MagY           | milligauss × 100                   |
| 38     | 4    | int32  | MagZ           | milligauss × 100                   |
| 42     | 4    | int32  | PressurePa     | Pascals × 100                      |
| 46     | 4    | int32  | TemperatureC   | Celsius × 100                      |
| 50     | 4    | int32  | Latitude       | degrees × 10^7 (NOT ×100)          |
| 54     | 4    | int32  | Longitude      | degrees × 10^7 (NOT ×100)          |
| 58     | 4    | int32  | GPSAltitude        | meters × 100                       |
| 62     | 1    | uint8  | Satellites         | GPS satellite count                 |
| 63     | 4    | int32  | BarometricAltitude | meters × 100, IIR filtered          |
| 67     | 4    | int32  | BarometricVelocity | m/s × 100, vertical velocity        |
| 71     | 4    | int32  | VelX               | m/s × 100 (currently 0)            |
| 75     | 4    | int32  | VelY               | m/s × 100 (currently 0)            |
| 79     | 4    | int32  | VelZ               | m/s × 100 (currently 0)            |
| 83     | 4    | uint32 | Flags              | Fault bitmask (see below)           |
| 87     | 4    | int32  | BatteryVoltage     | Volts × 100                        |
| 91     | 1    | uint8  | State              | State machine enum (see below)      |
| 92     | 1    | uint8  | RelayState         | Pyro bitmask (see below)            |
| 93     | 1    | uint8  | SyncEnd            | Always `0xBE`                       |

**Total: 94 bytes (packed, no padding)**

## Parsing Strategy

1. Read bytes from serial port into a rolling buffer.
2. Scan for sync word: byte `0xFE` followed by `0xCA`.
3. Once sync found, accumulate 94 bytes total (including sync).
4. Verify last byte is `0xBE` (footer). If not, discard and rescan.
5. Parse fields at their offsets using little-endian byte order.
6. For ×100 fields: `actual_value = raw_int32 / 100.0`
7. For Lat/Lon: `actual_degrees = raw_int32 / 10000000.0`

## State Machine Values

| Value | State            |
|-------|------------------|
| 0     | IDLE             |
| 1     | CALIBRATION      |
| 2     | PRELAUNCH        |
| 3     | BURN             |
| 4     | PASSIVE_BURNOUT  |
| 5     | ACTIVE_BURNOUT   |
| 6     | APOGEE           |
| 7     | PARACHUTE        |
| 8     | LANDED           |
| 9     | GROUND_ABORT     |
| 10    | DESCENT_ABORT    |

## Fault Flags (bitmask)

| Bit | Flag                              |
|-----|-----------------------------------|
| 0   | BMP280_MODE_IDLE_FAILED           |
| 1   | BMP280_MODE_PERFORMANCE_FAILED    |
| 2   | BMP581_MODE_IDLE_FAILED           |
| 3   | BMP581_MODE_PERFORMANCE_FAILED    |
| 4   | IIM42653_MODE_IDLE_FAILED         |
| 5   | IIM42653_MODE_PERFORMANCE_FAILED  |
| 6   | IIS2MDCTR_MODE_IDLE_FAILED        |
| 7   | IIS2MDCTR_MODE_PERFORMANCE_FAILED |
| 8   | SD_MOUNT_FAILED                   |
| 9   | SD_OPEN_FAILED                    |

## Relay State (bitmask)

| Bit | Meaning          |
|-----|------------------|
| 0   | DROGUE_FIRED     |
| 1   | PARACHUTE_FIRED  |

Latching: set on fire, cleared on safe.

## Ground Station Requirements

- Connect to COM port at 115200 baud, 8N1
- Parse incoming TelemetryPacket_t stream in real time
- Display all sensor values with appropriate units (divide ×100 fields)
- Show GPS position on a map or as coordinates
- Show current state machine state as text
- Show fault flags as individual indicators
- Show relay/pyro state
- Chart altitude, acceleration, velocity over time
- Handle dropped/corrupted packets gracefully (resync on `0xCAFE`)

## Sending Commands to the Flight Controller

The ground station can send commands using this framing:

| Byte | Value  | Description              |
|------|--------|--------------------------|
| 0    | `0xFE` | Header LSB               |
| 1    | `0xCA` | Header MSB               |
| 2    | CMD    | Command byte (see below) |
| 3    | `0x00` | Payload length (0 bytes)  |
| 4    | `0xBE` | Footer                   |

### Command Bytes

| Value  | Command     |
|--------|-------------|
| `0x01` | RESET       |
| `0x02` | GROUND_ABORT|
| `0x03` | CALIBRATION |
| `0x04` | DROGUE      |

These are 5-byte frames with no payload.

## Verification Checklist

1. Sync detected as bytes 0xFE 0xCA (little-endian uint16 0xCAFE)
2. All int32 fields parsed as little-endian, divided by 100.0 for display
3. Latitude/Longitude divided by 10000000.0 (NOT by 100)
4. Field order matches layout exactly — no gaps, no padding
5. Total packet size is exactly 94 bytes
6. Footer 0xBE checked at byte 93
7. State and RelayState are single bytes (not wider)
8. Telemetry rate is ~10 Hz (decimated from 100 Hz main loop)
