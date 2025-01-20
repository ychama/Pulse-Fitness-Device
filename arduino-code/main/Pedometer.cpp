#include "Pedometer.h"
#include "GlobalState.h"  // for gState

// If getFileCount() is still a separate function in your .ino, declare extern:
extern int getFileCount();

// RTC for date/time checks in resetDailySteps()
#include "RTClib.h"
extern RTC_PCF8523 rtc;

// IMU for acceleration data in updatePedometer()
#include <Arduino_LSM9DS1.h>
extern LSM9DS1Class IMU;

#include <Arduino.h>     // abs(), millis()
#include <SD.h>
#include <ArduinoJson.h> // for logging JSON in resetDailySteps()

/** 
 * Thresholds and constants
 * Renamed for clarity:
 */
static const int SAMPLE_BUFFER_SIZE       = 10;    // old NUM3
static const int MAX_BUFFER_SIZE          = 7;     // old NUM4
static const int WALK_THRESHOLD           = 15000; // old NUM5
static const int RUN_THRESHOLD            = 30000; // old NUM6
static const int STEP_DIFF_THRESHOLD      = 1300;  // old NUM7
static const double KCAL_PER_WALK         = 0.0392; // old KcalWalk
static const double KCAL_PER_RUN          = 0.0544; // old KcalRun

/**
 * updatePedometer()
 * 
 * Reads IMU data to detect walking/running steps, updates 
 * the global state's step counts, activity, and calorie burn.
 */
void updatePedometer(GlobalState &gState) 
{
  float ax, ay, az;
  if (!IMU.accelerationAvailable()) {
    return; // No new acceleration data, do nothing
  }

  IMU.readAcceleration(ax, ay, az);

  // Convert from 'g' to scaled int-like values
  ax = (ax * 32768.0f) / 4.0f;
  ay = (ay * 32768.0f) / 4.0f;
  az = (az * 32768.0f) / 4.0f;

  // Store the sum of absolute accelerations in the ring buffer
  gState.samplesOverInterval[gState.sampleIndex] =
    abs((int16_t)ax) + abs((int16_t)ay) + abs((int16_t)az);

  gState.lastSampleValue  = gState.nextSampleValue;
  gState.nextSampleValue  = gState.samplesOverInterval[gState.sampleIndex];

  // Every SAMPLE_BUFFER_SIZE samples, find the max reading 
  // and store it in samplesOverMax
  if (gState.sampleIndex == (SAMPLE_BUFFER_SIZE - 1)) {
    // Reset the current max to 0 for this slot
    gState.samplesOverMax[gState.sampleMaxIndex] = 0;
    for (int i = 0; i < SAMPLE_BUFFER_SIZE; i++) {
      if (gState.samplesOverMax[gState.sampleMaxIndex] < gState.samplesOverInterval[i]) {
        gState.samplesOverMax[gState.sampleMaxIndex] = gState.samplesOverInterval[i];
      }
    }
  }

  // Every MAX_BUFFER_SIZE sets, compute average movement
  if (gState.sampleMaxIndex == (MAX_BUFFER_SIZE - 1)) {
    gState.medianMovement = 0;
    for (int i = 0; i < MAX_BUFFER_SIZE; i++) {
      gState.medianMovement += gState.samplesOverMax[i] / MAX_BUFFER_SIZE;
    }
  }

  // Check thresholds for walking/running
  if (gState.medianMovement > WALK_THRESHOLD) {
    // If above run threshold
    if (gState.medianMovement > RUN_THRESHOLD) {
      gState.isRunning = false;
      gState.isWalking = false;
    } else {
      gState.isRunning = false;
      gState.isWalking = true;
    }

    // Detect half-step upward
    if ((gState.nextSampleValue > (gState.lastSampleValue + STEP_DIFF_THRESHOLD)) && (!gState.halfStepDetected)) {
      gState.halfStepDetected = true;
      gState.lastHalfStepTime = millis();
    }
    // Detect half-step downward
    if ((gState.nextSampleValue < (gState.lastSampleValue - STEP_DIFF_THRESHOLD)) && (gState.halfStepDetected)) {

      gState.activeSteps++;
      // Every 5 seconds, check if user is actually active
      if ((millis() - gState.stepCheckTimer) >= 5000) {
        if ((gState.activeSteps - gState.totalSteps) >= 10) {
          if (!gState.isActive) {
            gState.isActive = true;
            // Add chunk of steps 
            gState.totalSteps += (gState.activeSteps - gState.totalSteps);
            // Add chunk of calories
            gState.totalCalories += (gState.isRunning * KCAL_PER_RUN 
                                    + gState.isWalking * KCAL_PER_WALK)
                                  * (gState.activeSteps - gState.totalSteps);
          }
          gState.isActive = true;
        } else {
          gState.isActive = false;
        }
        gState.totalSteps   = gState.activeSteps;
        gState.stepCheckTimer = millis();
      }

      // If user is active, keep incrementing
      if (gState.isActive) {
        gState.totalSteps++;
        gState.totalCalories += (gState.isRunning * KCAL_PER_RUN 
                                 + gState.isWalking * KCAL_PER_WALK);
      }
      gState.halfStepDetected = false;
    }

  } else {
    gState.isWalking = false;
    gState.isRunning = false;
  }

  // If half step remains true for > 1s, reset it
  if ((millis() - gState.lastHalfStepTime) >= 1000) {
    gState.halfStepDetected = false;
    gState.isRunning        = false;
    gState.isWalking        = false;
  }

  // Advance ring-buffer indices
  gState.sampleIndex++;
  if (gState.sampleIndex >= SAMPLE_BUFFER_SIZE) {
    gState.sampleIndex = 0;
  }
  gState.sampleMaxIndex++;
  if (gState.sampleMaxIndex >= MAX_BUFFER_SIZE) {
    gState.sampleMaxIndex = 0;
  }
}

/**
 * resetDailySteps()
 * 
 * Resets daily steps at midnight. Logs a minimal JSON entry
 * to the SD card before clearing the counters.
 */
void resetDailySteps(GlobalState &gState)
{
  DateTime now = rtc.now();

  // If it's after 1 AM, we allow a reset next midnight
  if (now.hour() > 1) {
    gState.isNewDay = true;
  }

  // If midnight and we haven't reset yet, do so
  if ((now.hour() == 0) && (now.minute() == 0) && gState.isNewDay) {
    const int capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(4);
    StaticJsonDocument<capacity> doc;

    gState.fileEnding = getFileCount() + 1;

    // Minimal record of daily steps
    WorkoutInfo wi = {
      0,
      0,
      String(now.year()) + "/" + String(now.month()) + "/" +
      String(now.day())  + " " + String(now.hour()) + ":" +
      String(now.minute()),
      (int)(((double)gState.totalSteps) * 0.75)
    };

    doc[0]["hr"] = wi.heartRate;
    doc[0]["oL"] = wi.oxygenLevel;
    doc[0]["dt"] = wi.dateTime;
    doc[0]["st"] = wi.stepsTaken;

    File workoutFile = SD.open(gState.fileName + gState.fileEnding + ".txt", FILE_WRITE);
    if (!workoutFile) {
      Serial.println(F("Failed to create file for daily steps reset"));
      return;
    }
    if (serializeJson(doc, workoutFile) == 0) {
      Serial.println(F("Failed to write daily JSON to file"));
    }
    workoutFile.close();

    // Increment fileEnding for the next potential file
    gState.fileEnding++;
    doc.clear();

    // Now reset daily counters
    gState.totalSteps    = 0;
    gState.KcalMed       = 0;
    gState.stepMed       = 0;
    gState.totalCalories = 0;
    gState.isNewDay      = false;
  }
}
