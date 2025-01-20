#include "DisplayUI.h"
#include "GlobalState.h"

#include <Arduino.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <SD.h>
#include "RTClib.h"  // for RTC
#include <SparkFun_Bio_Sensor_Hub_Library.h> // for bioHub
#include <Arduino_LSM9DS1.h> // if your pedometer needs IMU (optional)

// If these are defined in main.ino or another file, declare them extern:
extern Adafruit_SSD1306 display;
extern SparkFun_Bio_Sensor_Hub bioHub; 
extern bioData body;          // struct to hold BPM data
extern RTC_PCF8523 rtc;

// from Pedometer module:
extern void resetSteps(GlobalState &gState);
extern void pedometer(GlobalState &gState);

// from main or elsewhere for reading the encoder:
extern void checkPosition();

// If getFileCount() is defined in BleHandler or elsewhere, extern it here:
extern int getFileCount();

// If you want to call BLE or Pedometer code inside the menus:
#include "BleHandler.h"
#include "Pedometer.h"

void mainMenu(GlobalState &gState) {
  checkPosition();
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  //---------------------------------
  DateTime now = rtc.now();
  display.setCursor(10, 10);

  display.print(now.year(), DEC);
  display.print('/');
  display.print(now.month(), DEC);
  display.print('/');
  display.print(now.day(), DEC);
  display.print(" ");
  display.print(now.hour(), DEC);
  display.print(':');
  display.print(now.minute(), DEC);
  display.println();

  display.setCursor(10, 20);
  display.println("Bluetooth");

  display.setCursor(10, 30);
  display.println("Sensor");

  display.setCursor(10, 40);
  display.print("Steps ");
  display.print((int)(((double)gState.totalSteps) * 0.75));
  display.println();

  if (gState.rEncoderSteps <= 3) {
    gState.cursorLocation = 20;
  }
  else {
    gState.cursorLocation = 30;
  }
  display.setCursor(2, gState.cursorLocation);
  display.println(">");

  display.display();

  if (gState.cursorLocation == 0) {
    delay(200);
    if (gState.cursorLocation == 20 && gState.cursorLocation == 0) {
      bluetoothMenu(gState);
    }
    else if (gState.cursorLocation == 30 && gState.cursorLocation == 0) {
      workoutMenu(gState);
    }
  }
}


void workoutMenu(GlobalState &gState)
{
  while (true) {
    checkPosition();

    // If you want to run pedometer or resetSteps each iteration:
    // pedometer(gState);
    // resetSteps(gState);

    display.clearDisplay();
    display.setTextColor(WHITE);
    display.setTextSize(1);

    display.setCursor(10, 20);
    display.println("Start Workout");

    display.setCursor(10, 30);
    display.println("EXIT");

    if (gState.rEncoderSteps <= 3) {
      gState.cursorLocation = 20;
    } else {
      gState.cursorLocation = 30;
    }
    display.setCursor(2, gState.cursorLocation);
    display.println(">");

    display.display();

    if (gState.buttonState == 0) {
      delay(200);
      if (gState.cursorLocation == 20) {
        workoutDisplay(gState);
      } else if (gState.cursorLocation == 30) {
        break;
      }
    }
  }
}

void workoutDisplay(GlobalState &gState)
{
  gState.isWorkingout = true;
  uint16_t previousHeartRate = 0;

  const int capacity = JSON_ARRAY_SIZE(10) + 10 * JSON_OBJECT_SIZE(4);
  StaticJsonDocument<capacity> doc;

  gState.fileEnding = getFileCount() + 1;
  Serial.println(gState.fileEnding);

  int i = 0;
  while (true) {
    // Check if the user wants to exit
    checkPosition();
    if (gState.cursorLocation == 0) {
      delay(200);
      if (gState.cursorLocation == 0) {
        // If JSON doc has data, write it out
        if (doc.memoryUsage() > 0) {
          Serial.println("here");
          File workoutFile = SD.open(gState.fileName + gState.fileEnding + ".txt", FILE_WRITE);
          if (!workoutFile) {
            Serial.println(F("Failed to create file"));
            return;
          }
          if (serializeJson(doc, workoutFile) == 0) {
            Serial.println(F("Failed to write to file"));
          }
          workoutFile.close();
          i = 0;
          gState.fileEnding++;
          doc.clear();
        }
        break;
      }
    }

    // Read data from sensor
    body = bioHub.readBpm();
    resetSteps(gState);
    pedometer(gState);

    // If sensor confidence is high and HR changed
    if (body.confidence > 90 && !(body.heartRate == previousHeartRate)) {
      delay(500);
      DateTime now = rtc.now();

      // Zero-pad strings
      String hourDec   = String(now.hour(), DEC);
      String minDec    = String(now.minute(), DEC);
      String monthStr  = String(now.month(), DEC);
      String dayStr    = String(now.day(), DEC);

      if (now.hour()   < 10) hourDec   = "0" + hourDec;
      if (now.minute() < 10) minDec    = "0" + minDec;
      if (now.month()  < 10) monthStr  = "0" + monthStr;
      if (now.day()    < 10) dayStr    = "0" + dayStr;

      WorkoutInfo wi = {
        body.heartRate,
        body.oxygen,
        String(now.year(), DEC) + "-" + monthStr + "-" +  dayStr + "T" + hourDec + ":" + minDec + ":00.000Z",
        (int)(((double)gState.totalSteps) * 0.75)
      };

      doc[i]["hr"] = wi.heartRate;
      doc[i]["oL"] = wi.oxygenLevel;
      doc[i]["dt"] = wi.dateTime;
      doc[i]["st"] = wi.stepsTaken;
      i++;
      Serial.println(i);
    }

    previousHeartRate = body.heartRate;

    // If doc array is full (10 entries), write to file
    if (i > 9) {
      Serial.println("here");
      File workoutFile = SD.open(gState.fileName + gState.fileEnding + ".txt", FILE_WRITE);
      if (!workoutFile) {
        Serial.println(F("Failed to create file"));
        return;
      }
      if (serializeJson(doc, workoutFile) == 0) {
        Serial.println(F("Failed to write to file"));
      }
      workoutFile.close();
      i = 0;
      gState.fileEnding++;
      doc.clear();
    }
    
    // Draw on the display
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    display.setCursor(10, 0);
    display.println(">End Workout");

    display.setCursor(10, 10);
    display.print("Heartrate: ");
    display.print(body.heartRate);

    display.setCursor(10, 20);
    display.print("Confidence: ");
    display.println(body.confidence);

    display.setCursor(10, 30);
    display.print("Oxygen: ");
    display.println(body.oxygen);

    display.setCursor(10, 40);
    display.print("Status: ");
    display.println(body.status);

    display.display();
  }
}

