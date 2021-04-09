/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        first_name
        last_name
        DOB
        pic
        sex
        height
        analytics {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAnalytics = /* GraphQL */ `
  query GetAnalytics($id: ID!) {
    getAnalytics(id: $id) {
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
export const listAnalyticss = /* GraphQL */ `
  query ListAnalyticss(
    $filter: ModelAnalyticsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnalyticss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getStepCount = /* GraphQL */ `
  query GetStepCount($id: ID!) {
    getStepCount(id: $id) {
      id
      step_count
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const listStepCounts = /* GraphQL */ `
  query ListStepCounts(
    $filter: ModelStepCountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStepCounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        step_count
        metrics
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHeartRate = /* GraphQL */ `
  query GetHeartRate($id: ID!) {
    getHeartRate(id: $id) {
      id
      heart_rate
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const listHeartRates = /* GraphQL */ `
  query ListHeartRates(
    $filter: ModelHeartRateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHeartRates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        heart_rate
        metrics
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getBloodOxygen = /* GraphQL */ `
  query GetBloodOxygen($id: ID!) {
    getBloodOxygen(id: $id) {
      id
      blood_oxygen
      metrics
      createdAt
      updatedAt
    }
  }
`;
export const listBloodOxygens = /* GraphQL */ `
  query ListBloodOxygens(
    $filter: ModelBloodOxygenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBloodOxygens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        blood_oxygen
        metrics
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByEmail = /* GraphQL */ `
  query UserByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        email
        first_name
        last_name
        DOB
        pic
        sex
        height
        analytics {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
