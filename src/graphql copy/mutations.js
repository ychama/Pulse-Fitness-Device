/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      first_name
      last_name
      DOB
      pic
      sex
      height
      analytics {
        items {
          id
          userID
          date_recorded
          stepCountID
          heartRateID
          bloodOxygenID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      first_name
      last_name
      DOB
      pic
      sex
      height
      analytics {
        items {
          id
          userID
          date_recorded
          stepCountID
          heartRateID
          bloodOxygenID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      first_name
      last_name
      DOB
      pic
      sex
      height
      analytics {
        items {
          id
          userID
          date_recorded
          stepCountID
          heartRateID
          bloodOxygenID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createAnalytics = /* GraphQL */ `
  mutation CreateAnalytics(
    $input: CreateAnalyticsInput!
    $condition: ModelAnalyticsConditionInput
  ) {
    createAnalytics(input: $input, condition: $condition) {
      id
      userID
      date_recorded
      stepCountID
      heartRateID
      bloodOxygenID
      stepCount {
        id
        step_count
        metrics
        createdAt
        updatedAt
      }
      heartRate {
        id
        heart_rate
        metrics
        createdAt
        updatedAt
      }
      bloodOxygen {
        id
        blood_oxygen
        metrics
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateAnalytics = /* GraphQL */ `
  mutation UpdateAnalytics(
    $input: UpdateAnalyticsInput!
    $condition: ModelAnalyticsConditionInput
  ) {
    updateAnalytics(input: $input, condition: $condition) {
      id
      userID
      date_recorded
      stepCountID
      heartRateID
      bloodOxygenID
      stepCount {
        id
        step_count
        metrics
        createdAt
        updatedAt
      }
      heartRate {
        id
        heart_rate
        metrics
        createdAt
        updatedAt
      }
      bloodOxygen {
        id
        blood_oxygen
        metrics
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteAnalytics = /* GraphQL */ `
  mutation DeleteAnalytics(
    $input: DeleteAnalyticsInput!
    $condition: ModelAnalyticsConditionInput
  ) {
    deleteAnalytics(input: $input, condition: $condition) {
      id
      userID
      date_recorded
      stepCountID
      heartRateID
      bloodOxygenID
      stepCount {
        id
        step_count
        metrics
        createdAt
        updatedAt
      }
      heartRate {
        id
        heart_rate
        metrics
        createdAt
        updatedAt
      }
      bloodOxygen {
        id
        blood_oxygen
        metrics
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createStepCount = /* GraphQL */ `
  mutation CreateStepCount(
    $input: CreateStepCountInput!
    $condition: ModelStepCountConditionInput
  ) {
    createStepCount(input: $input, condition: $condition) {
      id
      step_count
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const updateStepCount = /* GraphQL */ `
  mutation UpdateStepCount(
    $input: UpdateStepCountInput!
    $condition: ModelStepCountConditionInput
  ) {
    updateStepCount(input: $input, condition: $condition) {
      id
      step_count
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const deleteStepCount = /* GraphQL */ `
  mutation DeleteStepCount(
    $input: DeleteStepCountInput!
    $condition: ModelStepCountConditionInput
  ) {
    deleteStepCount(input: $input, condition: $condition) {
      id
      step_count
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const createHeartRate = /* GraphQL */ `
  mutation CreateHeartRate(
    $input: CreateHeartRateInput!
    $condition: ModelHeartRateConditionInput
  ) {
    createHeartRate(input: $input, condition: $condition) {
      id
      heart_rate
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const updateHeartRate = /* GraphQL */ `
  mutation UpdateHeartRate(
    $input: UpdateHeartRateInput!
    $condition: ModelHeartRateConditionInput
  ) {
    updateHeartRate(input: $input, condition: $condition) {
      id
      heart_rate
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const deleteHeartRate = /* GraphQL */ `
  mutation DeleteHeartRate(
    $input: DeleteHeartRateInput!
    $condition: ModelHeartRateConditionInput
  ) {
    deleteHeartRate(input: $input, condition: $condition) {
      id
      heart_rate
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const createBloodOxygen = /* GraphQL */ `
  mutation CreateBloodOxygen(
    $input: CreateBloodOxygenInput!
    $condition: ModelBloodOxygenConditionInput
  ) {
    createBloodOxygen(input: $input, condition: $condition) {
      id
      blood_oxygen
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const updateBloodOxygen = /* GraphQL */ `
  mutation UpdateBloodOxygen(
    $input: UpdateBloodOxygenInput!
    $condition: ModelBloodOxygenConditionInput
  ) {
    updateBloodOxygen(input: $input, condition: $condition) {
      id
      blood_oxygen
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const deleteBloodOxygen = /* GraphQL */ `
  mutation DeleteBloodOxygen(
    $input: DeleteBloodOxygenInput!
    $condition: ModelBloodOxygenConditionInput
  ) {
    deleteBloodOxygen(input: $input, condition: $condition) {
      id
      blood_oxygen
      metrics
      createdAt
      updatedAt
    }
  }
`;
