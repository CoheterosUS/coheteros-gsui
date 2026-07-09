//***** RECEPTOR *****
// Módulo: EBYTE E32 900T30D

#include <SoftwareSerial.h>
#include "LoRa_E32.h"

// Pines de conexión al Arduino UNO (Receptor)
#define PIN_RX 8
#define PIN_TX 7
#define PIN_M0 4
#define PIN_M1 5
#define PIN_AUX 6

SoftwareSerial mySerial(PIN_RX, PIN_TX);
LoRa_E32 e32ttl(&mySerial, PIN_AUX, PIN_M0, PIN_M1);

// LA ESTRUCTURA DEBE SER UN CLON EXACTO DE LA DEL EMISOR (41 BYTES)
struct __attribute__((packed)) PaqueteTelemetria {
    // --- HEADER (2 bytes) ---
    uint8_t header1;         
    uint8_t header2;         

    // --- PAYLOAD (Datos - 37 bytes) ---
    int32_t altitude;        
    uint8_t gpsAltitude;     
    uint8_t flightStatus;    
    int16_t accX;            
    int16_t accY;            
    int16_t accZ;            
    int16_t gyroX;           
    int16_t gyroY;           
    int16_t gyroZ;           
    int16_t roll;            
    int16_t pitch;           
    uint16_t yaw;            
    int32_t gpsLatitude;     
    int32_t gpsLongitude;    
    int16_t batteryVoltage;  
    int16_t temperature;     
    uint8_t timestamp;       

    // --- FOOTER (2 bytes) ---
    // uint8_t footer1;         
    // uint8_t footer2;         
};

void setup() {
  digitalWrite(PIN_M0,LOW);
  digitalWrite(PIN_M1,LOW);

  Serial.begin(9600);
  e32ttl.begin(); 
  
  Serial.println(F("--- ESTACIÓN BASE LISTA PARA RECIBIR ---"));
}

void loop() {
  if (e32ttl.available() > 1) {
    
    ResponseStructContainer rsc = e32ttl.receiveMessage(sizeof(PaqueteTelemetria));

    if (rsc.status.code == 1) {
      
      PaqueteTelemetria datos = *(PaqueteTelemetria*) rsc.data;
      rsc.close(); 

      // VALIDACIÓN DE HEADER Y FOOTER
      if (datos.header1 == 0xAA && datos.header2 == 0xBB) {
          
          // Envía los 41 bytes crudos a través del puerto serie USB
          Serial.write((uint8_t*)&datos, sizeof(PaqueteTelemetria));

      } else {
          // Vaciamos el búfer del puerto serie para "resetear" la lectura
          while (mySerial.available()) {
              mySerial.read(); 
          }
      }
    }
  }
}
