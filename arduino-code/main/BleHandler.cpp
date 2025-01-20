/**
 * Handles Bluetooth menus, data transmissions, and connection events.
 * Uses an SD card for file storage, sending file contents over BLE 
 * to a connected central device.
 */

#include "BleHandler.h"
#include "GlobalState.h"

// Arduino / library includes
#include <Arduino.h>
#include <ArduinoJson.h>
#include <SD.h>
#include <Adafruit_SSD1306.h>  // for display output

// References to BLE objects defined in main.ino
extern BLEDevice central;
extern BLEService webService;
extern BLECharacteristic sensorChar;

// If we're displaying messages on the SSD1306:
extern Adafruit_SSD1306 display;

// If needed, you can also extern RTC or IMU here:
// extern RTC_PCF8523 rtc;
// extern LSM9DS1Class IMU;

/**
 * getFileCount()
 * 
 * Counts the number of valid files (non-directory, no '~' in filename) 
 * at the root of the SD card. Returns the total file count.
 */
int getFileCount() 
{
  File rootDir = SD.open("/");
  if (!rootDir) {
    return 0;
  }

  int count = 0;
  while (true) {
    File entry = rootDir.openNextFile();
    if (!entry) {
      // No more files
      break;
    }

    String fileName = entry.name();
    // Ignore directories and files with '~' in name
    if (!entry.isDirectory() && fileName.indexOf('~') < 0) {
      count++;
    }
    entry.close();
  }

  rootDir.close();
  return count;
}

/**
 * bluetoothMenu()
 * 
 * Displays a simple ON / EXIT menu for controlling BLE on the SSD1306 display.
 * If ON is selected, it calls bluetoothTransmissionMenu(). 
 * Otherwise, it exits back to the previous menu.
 */
void bluetoothMenu(GlobalState &gState)
{
  while (true) {
    // If using an encoder for navigation, call your encoder function here:
    // extern void updateEncoder();
    // updateEncoder();

    display.clearDisplay();
    display.setTextColor(WHITE);
    display.setTextSize(1);

    display.setCursor(10, 20);
    display.println("ON");

    display.setCursor(10, 30);
    display.println("EXIT");

    // Simple logic to pick which line is highlighted
    if (gState.rEncoderSteps <= 2) {
      gState.cursorLocation = 20;
    } else {
      gState.cursorLocation = 30;
    }

    // Show selection cursor
    display.setCursor(2, gState.cursorLocation);
    display.println(">");

    display.display();

    // Check for button press
    if (gState.buttonState == 0) {
      delay(200); // basic debounce
      if (gState.cursorLocation == 20) {
        bluetoothTransmissionMenu(gState);
      } else if (gState.cursorLocation == 30) {
        break; // exit loop
      }
    }
  }
}

/**
 * bluetoothTransmissionMenu()
 * 
 * Advertises the BLE service and waits for a central to connect.
 * Once a central connects, blePeripheralConnectHandler() is called
 * to manage sending data.
 */
void bluetoothTransmissionMenu(GlobalState &gState)
{
  gState.isTransmitting = true;
  BLE.advertise();  // Start advertising

  while (true) {
    display.clearDisplay();
    display.setTextColor(WHITE);
    display.setTextSize(1);

    display.setCursor(10, 20);
    display.println("Bluetooth is on...");
    display.setCursor(10, 30);
    display.println("Waiting for connection...");

    display.display();

    // If you want to allow a button press to exit:
    // if (gState.buttonState == 0) {
    //   gState.isTransmitting = false;
    //   break;
    // }

    central = BLE.central();
    if (central) {
      // A central device connected, handle the connection
      blePeripheralConnectHandler(central, gState);
      // After finishing, stop advertising and disconnect
      BLE.stopAdvertise();
      BLE.disconnect();
      break;
    }

    // If we manually ended transmission
    if (!gState.isTransmitting) {
      BLE.stopAdvertise();
      BLE.disconnect();
      break;
    }
  }
}

/**
 * blePeripheralConnectHandler()
 * 
 * Called when a central device connects. Iterates over all files in the SD 
 * root directory, sends them via BLE, and optionally deletes them afterward. 
 * Uses a JSON-based approach to send file data to sensorChar.
 */
void blePeripheralConnectHandler(BLEDevice central, GlobalState &gState)
{
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);

  display.setCursor(10, 20);
  display.println("Sending Data...");
  display.display();

  // Adjust capacity for your data size
  const int capacity = JSON_ARRAY_SIZE(10) + 10 * JSON_OBJECT_SIZE(4);
  DynamicJsonDocument doc(capacity);

  Serial.print("Connected event, central: ");
  Serial.println(central.address());

  File rootDir = SD.open("/");
  if (!rootDir) {
    Serial.println("Failed to open SD root!");
    gState.isTransmitting = false;
    return;
  }

  while (true) {
    File entry = rootDir.openNextFile();
    if (!entry) {
      // No more files
      break;
    }

    String fileName = entry.name();
    // Skip directories or files containing '~'
    if (fileName.indexOf('~') >= 0 || entry.isDirectory()) {
      entry.close();
      continue;
    }

    // Deserialize JSON from this file
    DeserializationError parseErr = deserializeJson(doc, entry);
    entry.close();
    if (parseErr) {
      Serial.println("Failed to parse JSON from file!");
      doc.clear();
      continue;
    }

    // Convert doc to a JSON string
    char jsonString[512];
    serializeJson(doc, jsonString, sizeof(jsonString));
    doc.clear();

    Serial.print("Sending file: ");
    Serial.println(fileName);

    // Send data to the characteristic
    sensorChar.writeValue((const unsigned char*)jsonString, strlen(jsonString));

    // Remove file if central is still connected
    if (central.connected()) {
      SD.remove(fileName);
    }

    // If central disconnects unexpectedly, stop
    if (!central.connected()) {
      break;
    }

    delay(500); // Small gap between file sends
  }

  rootDir.close();
  gState.isTransmitting = false;
  delay(2000);
}
