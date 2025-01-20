#pragma once

// Forward-declare GlobalState so we can reference it
struct GlobalState;

void updatePedometer(GlobalState &gState);
void resetDailySteps(GlobalState &gState);
