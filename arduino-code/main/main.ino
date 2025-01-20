/********************************************************
 * Main entry point for the project, with setup() and loop().
 * Initializes hardware (RTC, BLE, SD, Bio Sensor, Display, IMU),
 * and calls modularized functions for pedometer and UI.
 ********************************************************/

#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <SD.h>
#include <limits.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoBLE.h>
#include <ArduinoJson.h>
#include <Arduino_LSM9DS1.h>
#include <RotaryEncoder.h>
#include <SparkFun_Bio_Sensor_Hub_Library.h>
#include "RTClib.h"

#include "GlobalState.h"
#include "Pedometer.h"
#include "BleHandler.h"
#include "DisplayUI.h"


/** --------- Pin / Hardware Definitions --------- */
// OLED
#define SCREEN_WIDTH    128
#define SCREEN_HEIGHT    64
#define OLED_RESET      -1   // or -1 if sharing Arduino reset pin
#define SCREEN_ADDRESS  0x3D  // 0x3D for 128x64, 0x3C for 128x32

// Rotary encoder
#define PIN_IN1  6
#define PIN_IN2  7
#define PB_IN    2

// Bio Sensor
#define SEN_RST  4
#define MFIO     5

// SD card
#define SD_IN    10

// BLE
BLEDevice central;
BLEService webService("739f9f96-8a7b-11eb-8dcd-0242ac130003");
BLECharacteristic sensorChar("69567fb9-cba3-41db-a8e4-84e951fefdfe",
                             BLEWrite | BLERead | BLENotify,
                             512);

/** --------- RTC Setup --------- */
RTC_PCF8523 rtc;
char daysOfTheWeek[7][12] = {
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
};

/** --------- Global State / Objects --------- */
// We declare our shared state struct
GlobalState gState;

// Bio Sensor data structure
bioData body;

// Our main display object
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Rotary encoder object
RotaryEncoder encoder(PIN_IN1, PIN_IN2, RotaryEncoder::LatchMode::TWO03);

// SparkFun Bio Sensor Hub
SparkFun_Bio_Sensor_Hub bioHub(SEN_RST, MFIO);


/********************************************************
 * setup()
 * Runs once at power-up or reset. Initializes hardware.
 ********************************************************/
void setup() {
  Serial.begin(115200);


  /**** Initialize RTC ****/
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    abort();
  }
  delay(2000);
  if (!rtc.initialized() || rtc.lostPower()) {
    Serial.println("RTC is NOT initialized; setting time...");
    // Set to compile time:
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  // Force the RTC to the time at compile:
  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  rtc.start();

  // (Optional) RTC calibration example
  float drift      = 43;       // sec plus/minus over observation
  float period_sec = 7 * 86400;  
  float deviation_ppm = (drift / period_sec) * 1000000;
  float drift_unit = 4.34; 
  int offset       = round(deviation_ppm / drift_unit);
  Serial.print("Offset is ");
  Serial.println(offset);
  // rtc.calibrate(PCF8523_TwoHours, offset); // or 0 to cancel previous

  /**** Initialize Encoder Pins & Interrupts ****/
  pinMode(PB_IN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_IN1), checkPosition, CHANGE);
  attachInterrupt(digitalPinToInterrupt(PIN_IN2), checkPosition, CHANGE);

  /**** Initialize BLE ****/
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (true);
  }
  BLE.setDeviceName("PULSE");
  BLE.setLocalName("PULSE");
  BLE.setAdvertisedService(webService);
  webService.addCharacteristic(sensorChar);
  BLE.addService(webService);

  unsigned char heartRateCharArray[2] = {0, 0};
  sensorChar.writeValue(heartRateCharArray, 2);

  Serial.println("BLE initialized.");

  /**** Initialize SD Card ****/
  Serial.print("Initializing SD card...");
  if (!SD.begin(SD_IN)) {
    Serial.println("SD init failed!");
    while (true);
  }
  Serial.println("SD init done.");

  /**** Initialize Bio Sensor ****/
  Wire.begin();
  int result = bioHub.begin();
  if (result == 0) {
    Serial.println("Sensor started!");
  } else {
    Serial.println("Could not communicate with the sensor!!!");
  }

  Serial.println("Configuring Sensor....");
  int error = bioHub.configBpm(MODE_ONE); // BPM settings only
  if (error == 0) {
    Serial.println("Sensor configured.");
  } else {
    Serial.print("Error configuring sensor: ");
    Serial.println(error);
  }
  // Let buffer catch up
  Serial.println("Loading up the buffer with data....");
  delay(4000);

  /**** Initialize Display ****/
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    while (true);
  }
  // Display Adafruit splash
  display.display();
  delay(2000);

  display.clearDisplay();
  display.drawPixel(10, 10, SSD1306_WHITE);
  display.display();
  delay(2000);

  /**** Initialize IMU ****/
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (true);
  }
  gState.stepCheckTimer = 0;

  Serial.println("Setup ended successfully");
}

/********************************************************
 * checkPosition()
 * Interrupt routine for the rotary encoder.
 ********************************************************/
void checkPosition() {
  encoder.tick(); // just call tick() to update the encoder state
}


/********************************************************
 * updateEncoder()
 * Reads the encoder and updates gState accordingly.
 ********************************************************/
void updateEncoder() {
  // Example: store button read
  gState.cursorLocation = digitalRead(PB_IN);

  // Zero out pos for each read
  gState.pos = 0;
  encoder.tick();

  // Compare positions
  int newPos = encoder.getPosition();
  int change = newPos - gState.pos;

  if (abs(change) >= 4) {
    int encoderDirection = (int)(encoder.getDirection());
    gState.rEncoderSteps += encoderDirection;

    if (gState.rEncoderSteps < 0) {
      gState.rEncoderSteps = 5;
    }
    gState.rEncoderSteps = gState.rEncoderSteps % 6;

    gState.pos = newPos;
  }
}


/********************************************************
 * loop()
 * Runs repeatedly after setup. We call our main UI,
 * pedometer, and step reset logic each iteration.
 ********************************************************/
void loop() {
  mainMenu(gState);      // from DisplayUI
  updatePedometer(gState);     // from Pedometer
  resetDailySteps(gState);    // from Pedometer
  delay(100);
}

