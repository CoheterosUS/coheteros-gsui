# Telemetry Packet Specification

STM32H723 flight controller sends `FlightData_t` as raw bytes over UART1 (DMA). No protocol wrapping — the struct IS the packet. Little-endian (ARM Cortex-M7). Packed (`#pragma pack(push, 1)`), no padding. Total: 85 bytes.

## Framing

- Sync word `0xCAFE` at offset 0 (little-endian on wire: `0xFE` then `0xCA`)
- Footer byte `0xBE` at offset 84
- No length field, no checksum, no CRC — fixed-size packet
- UI should scan for `0xFE 0xCA` to find packet start, read 85 bytes, verify last byte is `0xBE`

## Packet Layout

```
Offset  Size  Type     Field           Unit / Notes
------  ----  -------  --------------  ----------------------------------------
0       2     uint16   Sync            Always 0xCAFE (wire: 0xFE 0xCA)
2       4     uint32   Tick            FreeRTOS tick count (ms)
6       4     float32  AccelX          m/s² (IIM42653, scale: 9.81/1024)
10      4     float32  AccelY          m/s²
14      4     float32  AccelZ          m/s²
18      4     float32  GyroX           dps (bias-corrected, scale: 1/16.4)
22      4     float32  GyroY           dps
26      4     float32  GyroZ           dps
30      4     float32  MagX            milligauss (IIS2MDCTR, scale: 1.5)
34      4     float32  MagY            milligauss
38      4     float32  MagZ            milligauss
42      4     float32  PressurePa      Pascals (BMP581)
46      4     float32  TemperatureC    Celsius
50      4     int32    Latitude        Currently 0 (GPS not connected)
54      4     int32    Longitude       Currently 0
58      4     float32  Altitude        meters (barometric, IIR filtered)
62      4     float32  VelX            m/s (currently 0)
66      4     float32  VelY            m/s (vertical velocity, calculated)
70      4     float32  VelZ            m/s (currently 0)
74      4     uint32   Flags           Bitmask of SystemFaultFlag_t
78      4     float32  BatteryVoltage  Volts (currently hardcoded 0)
82      1     uint8    State           SystemState_t enum value (0-11)
83      1     uint8    RelayState      Pyro channel bitmask
84      1     uint8    SyncEnd         Always 0xBE
```

## State Enum Values

```
0 = IDLE
1 = CALIBRATION
2 = PRELAUNCH
3 = BURN
4 = PASSIVE_BURNOUT
5 = ACTIVE_BURNOUT
6 = APOGEE
7 = PARACHUTE
8 = LANDED
9 = GROUND_ABORT
10 = ASCENT_ABORT
11 = DESCENT_ABORT
```

## Fault Flags Bitmask (uint32 Flags field)

```
Bit 0 = BMP280_MODE_IDLE_FAILED
Bit 1 = BMP280_MODE_PERFORMANCE_FAILED
Bit 2 = BMP581_MODE_IDLE_FAILED
Bit 3 = BMP581_MODE_PERFORMANCE_FAILED
Bit 4 = IIM42653_MODE_IDLE_FAILED
Bit 5 = IIM42653_MODE_PERFORMANCE_FAILED
Bit 6 = IIS2MDCTR_MODE_IDLE_FAILED
Bit 7 = IIS2MDCTR_MODE_PERFORMANCE_FAILED
Bit 8 = SD_MOUNT_FAILED
Bit 9 = SD_OPEN_FAILED
```

## RelayState Bitmask (uint8)

```
Bit 0 = PYRO_FLAG_DROGUE_FIRED (drogue chute fired)
Bit 1 = PYRO_FLAG_PARACHUTE_FIRED (main chute fired)
```

## Verification Checklist

1. Sync detected as bytes 0xFE 0xCA (little-endian uint16 0xCAFE)
2. All floats parsed as IEEE 754 single-precision, little-endian
3. All int32/uint32 parsed as little-endian
4. Field order matches layout exactly — no gaps, no padding
5. Total packet size is exactly 85 bytes
6. Footer 0xBE checked at byte 84
7. Latitude/Longitude treated as signed int32 (not float)
8. State and RelayState are single bytes (not wider)
