#pragma once

#include <ArduinoBLE.h> // so the BLEDevice type is known

// Forward-declare GlobalState
struct GlobalState;

/**
 *
 * Declarations of all BLE-related functions.
 */
// File processing Logic
int getFileCount();

// The main BLE menu
void bluetoothMenu(GlobalState &gState);

// Transmission menu
void bluetoothTransmissionMenu(GlobalState &gState);

// Peripheral connect callback
void blePeripheralConnectHandler(BLEDevice central, GlobalState &gState);
