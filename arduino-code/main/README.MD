# Wearable Fitness Device Project

## Overview

This project implements a wearable fitness device that measures heart rate, oxygen levels, and step counts. It also features Bluetooth (BLE) connectivity to transmit data to a central device. The code is organized into several modules for clarity and maintainability:

- **GlobalState.h**:  
  Contains the `GlobalState` data structure that holds all shared global variables (e.g., UI state, pedometer data, BLE flags, timers, and file logging information).

- **Pedometer.h / Pedometer.cpp**:  
  Implements the step counter logic. The pedometer module processes IMU acceleration data to detect steps, distinguishes between walking and running based on movement thresholds, updates step counters and estimates calories burned, and resets daily data using RTC information.

- **BleHandler.h / BleHandler.cpp**:  
  Manages Bluetooth functionality, including BLE advertising, sending JSON-formatted workout logs from an SD card, and handling BLE connection events.

- **DisplayUI.h / DisplayUI.cpp**:  
  Provides the OLED user interface. This module displays menus (e.g., main menu, workout display) and uses input from a rotary encoder and a button to navigate between screens.

- **main.ino**:  
  The main Arduino sketch that initializes all hardware (RTC, IMU, BLE, SD, bio-sensor, OLED display, rotary encoder) and calls functions from the different modules in its `setup()` and `loop()` routines.

## How Everything Connects

1. **Initialization in main.ino:**
   - **RTC**: Ensures accurate timekeeping.
   - **IMU**: Provides acceleration data used for detecting steps.
   - **Bio Sensor**: Measures heart rate and oxygen levels.
   - **BLE**: Sets up and advertises a custom service and characteristic.
   - **SD Card**: Logs workout data in JSON format.
   - **OLED Display & Rotary Encoder**: Provide a user interface for navigation.
   - A single instance of `GlobalState` (`gState`) is created and shared across modules.

2. **Modular Interaction:**
   - **DisplayUI** reads and updates `gState` to manage UI elements. It calls BLE functions (e.g., `bluetoothMenu(gState)`) and workout functions (e.g., `workoutDisplay(gState)`).
   - **BleHandler** accesses file logging data via `gState` (e.g., `gState.fileEnding` and `gState.fileName`) to send stored JSON files via BLE.
   - **Pedometer** continuously processes IMU data, updating buffers, and determining steps and calories, storing these values in `gState`.
   - **GlobalState** acts as the central data hub for inter-module communication.

## Detailed Explanation of the Step Counter Algorithm

The pedometer algorithm uses acceleration data from the IMU to robustly detect steps and estimate activity. Here's how it works in detail:

### 1. Data Acquisition and Scaling
- **Sampling:**  
  The algorithm polls the IMU for acceleration values along the X, Y, and Z axes.
- **Scaling:**  
  The raw acceleration values (in g’s) are scaled (using a factor such as 32768/4) to convert them into a numerical range that facilitates integer arithmetic and threshold comparisons.

### 2. Ring Buffer Storage
- **Short-Term Buffer:**  
  The sum of the absolute acceleration values is calculated and stored in a ring buffer (`samplesOverInterval`), which holds a fixed number (e.g., 10) of recent samples.
- **Interval Maximum Calculation:**  
  Once the short-term buffer is full, the algorithm calculates the maximum value from these samples and stores it in a second ring buffer (`samplesOverMax`). This captures the peak movement intensity during the interval.

### 3. Movement Estimation
- **Averaging Peak Values:**  
  After collecting a set number (e.g., 7) of maximum values, the algorithm computes an average value, referred to as `medianMovement`. This average provides an index of overall movement intensity.
- **Threshold Comparison:**  
  Two thresholds are defined:
  - **Walking Threshold:** If `medianMovement` exceeds this level, the user is considered walking.
  - **Running Threshold:** If it exceeds the higher threshold, the movement may be classified as running.
  Based on these comparisons, the flags `isWalking` and `isRunning` are set accordingly.

### 4. Half-Step Detection and Full Step Confirmation
- **Half-Step Detection:**  
  A significant rise in acceleration beyond a specified threshold (the `STEP_DIFF_THRESHOLD`) triggers a half-step detection, setting `halfStepDetected` to true and recording the timestamp.
- **Full Step Confirmation:**  
  On a subsequent fall in acceleration (below the negative threshold) while the half-step flag is active, the algorithm confirms a full step. This increments the `activeSteps` counter.
- **Activity Check:**  
  Every few seconds (e.g., 5 seconds), the algorithm checks if at least 10 steps were detected. If yes, it confirms the period as active and adds the new steps to the overall `totalSteps` and updates the calorie count.
- **Timeout:**  
  If no corresponding falling edge is detected within one second, the half-step flag is reset to prevent false triggers.

### 5. Calorie Estimation
- **Per-Step Calculation:**  
  Every confirmed step increments `totalCalories`, using predefined constants for walking or running. This gives a rough estimation of calories burned during the activity.

### 6. Daily Reset
- **Midnight Check:**  
  The RTC monitors the time, and at midnight the algorithm logs the day’s data (via JSON) to the SD card.
- **Reset:**  
  After logging, daily counters such as `totalSteps` and `totalCalories` are reset for the new day.

---

## Hardware

### 4.1.1 Arduino Nano 33 BLE Sense

The **Arduino Nano 33 BLE Sense** was chosen for its compact size and integrated features, essential for this wearable fitness device. Key specifications and functionalities include:

- **Microcontroller:** ARM-based nRF52840, providing sufficient processing power for real-time data acquisition and algorithm execution.
- **Integrated Sensors:**  
  - Accelerometer and gyroscope, used for step tracking and activity classification. These sensors provide acceleration data, enabling precise movement detection for the pedometer algorithm.  
- **Bluetooth Low Energy (BLE):**  
  - Built-in BLE module for wireless communication with external devices (e.g., smartphones or computers).  
- **Power Management:**  
  - Operates using 3.3V logic, with onboard circuitry to step down input voltages (4.2V–21V) to 3.3V, powering other components in the system.  
- **Communication Protocols:**  
  - Supports I2C and SPI, which were critical for integrating other peripherals like the heart rate sensor, SD card breakout board, and OLED display.

This board serves as the central controller, orchestrating all data processing, communication, and hardware interaction.

---

### 4.1.2 Power Supply

The power supply system consists of:  
1. **400 mAh LiPo Battery:**  
   - Nominal voltage: 3.7V (operating range: 3.0V–4.2V).  
   - Powers the device for several hours of continuous use, depending on activity level.  

2. **Adafruit PowerBoost 500C Charger:**  
   - Provides regulated 5V output, suitable for powering the Arduino Nano 33 BLE Sense.  
   - Features CC/CV charging for LiPo batteries, ensuring safe and efficient charging.  
   - Allows simultaneous charging and operation of the device, automatically switching power sources between the battery and USB input as needed.  

This design ensures reliable power delivery and the ability to operate without interruptions during charging.

---

### 4.1.3 Heart Rate and Blood Oximetry Sensor

The **SparkFun SEN-15219** integrates two Maxim Integrated components:  
1. **MAX30101 Pulse Oximeter and Heart Rate Sensor:**  
   - Measures heart rate and SpO2 levels using photoplethysmography, which bounces LED light off subcutaneous arteries and measures light absorption.  
2. **MAX32664 Biometric Sensor Hub:**  
   - Processes raw sensor data using advanced algorithms, including digital filtering, position compensation, and R-wave detection.  
   - Outputs reliable data through the I2C interface, simplifying integration with the Arduino.  

Power is supplied via the Arduino’s 3.3V output, and a third-party library is used for high-level communication with the sensor.

---

### 4.1.4 Data Storage

The **Adafruit 254 MicroSD Breakout Board** is used to store workout data in JSON format. Key details:  
- Operates at both 3.3V and 5V, ensuring compatibility with the Arduino’s 3.3V logic.  
- Communicates via the SPI protocol, using a GPIO pin as the Chip Select (CS) line.  
- Enables logging of daily metrics such as steps, calories, and heart rate for later retrieval.

---

### 4.1.5 Display

The **Adafruit 938 OLED Display** features a 1.3” monochrome screen with a resolution of 128 × 64 pixels. Key advantages:  
- **Low Power Consumption:**  
  - Only lights up necessary pixels, reducing power usage compared to backlit LCDs.  
- **High Contrast:**  
  - Ensures readability even with a small screen size.  
- **I2C Communication:**  
  - Requires only two connections (SDA and SCL) for data transmission, simplifying wiring.  
- **Voltage Compatibility:**  
  - Operates with both 3.3V and 5V, ensuring seamless integration with the Arduino.

This display presents user data such as heart rate, steps, and menu options in a compact, efficient format.

---

### 4.1.6 Rotary Encoder

The **Rotary Encoder** acts as the primary input method for the user interface. Key details:  
- **Push Button:**  
  - Provides an additional control mechanism, with active-low logic (requires enabling pull-up resistors).  
- **Rotational Input:**  
  - Outputs a pulse train through two pins, where the phase difference determines the direction of rotation.  
- **Algorithm:**  
  - Interprets encoder signals to navigate through 24 positions, divided into menu sections.  
  - Rotating the encoder cycles through options, while pressing the button selects the desired option.  

This module enables intuitive navigation and control of the device’s features.

---

### 4.1.7 Overall Hardware Integration

The components are seamlessly integrated to form a functional, wearable fitness device:  
- The Arduino Nano 33 BLE Sense serves as the central hub, coordinating data acquisition, processing, and communication.  
- Peripherals like the heart rate sensor, SD card, OLED display, and rotary encoder are connected using I2C or SPI protocols for efficient data exchange.  
- The power system ensures uninterrupted operation, even during charging.  

Together, these components provide robust functionality in a compact, wearable form factor.

---

## Dependencies

The following dependencies are required for the project:

1. **Adafruit_BusIO**
2. **Adafruit_GFX_Library**
3. **Adafruit_SSD1306**
4. **Arduino_LSM9DS1**
5. **ArduinoBLE**
6. **ArduinoJson**
7. **RotaryEncoder**
8. **RTClib**
9. **SparkFun_Bio_Sensor_Hub_Library**
10. **Vector**

Ensure these libraries are included in your development environment before running the project.

---

## Final Notes

- **Modular Structure:**  
  Each module (GlobalState, Pedometer, BLE Handler, Display UI) encapsulates specific functionality. Communication between modules is achieved through the shared `GlobalState` instance.
  
- **Extensibility:**  
  Thresholds such as the walking and running thresholds, along with the step detection criteria, can be tuned to improve accuracy for different users and sensor characteristics.
  
- **Future Enhancements:**  
  This design is modular enough to allow for new features such as improved activity classification, more detailed calorie computation, or integration with mobile applications via BLE.

Enjoy experimenting with the code and refining the step counter algorithm to suit your needs!

---

*If you have any questions or feedback, please refer to the documentation in each module, or feel free to reach out for assistance.*
