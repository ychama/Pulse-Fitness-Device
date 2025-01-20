#pragma once

// Forward-declare GlobalState so we can reference it
struct GlobalState;

/**
 * DisplayUI.h
 * 
 * Declarations of UI-related functions, e.g. main menu,
 * workout menu, workout display, etc.
 */

void mainMenu(GlobalState &gState);
void workoutMenu(GlobalState &gState);
void workoutDisplay(GlobalState &gState);
