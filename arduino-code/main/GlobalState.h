#pragma once
#include <Arduino.h>

 // Top-level struct
struct WorkoutInfo {
  uint16_t heartRate;
  uint16_t oxygenLevel;
  String   dateTime;
  uint16_t stepsTaken;
};

/**
 * GlobalState
 *
 * Holds all shared variables for the project, including:
 * - File/logging info for SD writes
 * - Encoder/UI state
 * - Pedometer data and step counters
 * - Timers, flags, and any optional arrays
 */




struct GlobalState {

  // ---------- File / Logging ----------
  // Used when generating new filenames on the SD card
  int    fileEnding  = 0;
  String fileName    = "da";

  // ---------- Encoder / UI ----------
  // Tracks the rotary encoder state, button input,
  // and whether the device is transmitting or in a workout
  int  rEncoderSteps  = 0;
  int  buttonState    = 1;
  int  pos            = 0;
  int  cursorLocation = 20;

  bool isWorkingout   = false;
  volatile int isTransmitting = false;

  // ---------- Pedometer / Steps ----------
  // Daily / total step counters and step detection logic
  unsigned long totalSteps    = 0; // overall step count
  unsigned long dailySteps    = 0; // optional if you distinguish daily from total
  unsigned long activeSteps   = 0; // steps taken during active intervals

  // Activity flags
  bool isRunning        = false;
  bool isWalking        = false;
  bool halfStepDetected = false; // used for half-step transitions
  bool isActive         = false; // user is currently in active movement
  bool isNewDay         = false; // triggers daily reset at midnight

  // Acceleration-based ring buffers
  unsigned long samplesOverInterval[10]; // stores recent sums of absolute accelerations
  unsigned long samplesOverMax[7];       // stores max values from intervals
  unsigned long medianMovement    = 0;   // average or "median" of the max values

  // Tracking the last/next acceleration sums
  unsigned long lastSampleValue   = 0;
  unsigned long nextSampleValue   = 0;

  // Timers used for half-step and interval checks
  unsigned long lastHalfStepTime  = 0;  // timestamp for half-step detection
  int           stepCheckTimer     = 0; // used for periodic active-check intervals

  // ---------- Calorie Calculation ----------
  double totalCalories   = 0; // accumulative calories burned

  // ---------- Indices for ring buffers ----------
  int sampleIndex        = 0; // current index for samplesOverInterval
  int sampleMaxIndex     = 0; // current index for samplesOverMax

  // ---------- Optional / Legacy Arrays ----------
  unsigned int KcalD[7];          
  unsigned int stepD[7];     
  unsigned int KcalMed;      
  unsigned long KcalT = 0;   
  unsigned int stepMed;      
  unsigned long stepT = 0;   
  int timer_var2;            
};
