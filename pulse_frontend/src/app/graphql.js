import gql from "graphql-tag";

//mutations
const createUser = gql`
  mutation(
    $username: String!
    $first_name: String!
    $last_name: String!
    $DOB: AWSDate!
    $sex: Sex!
    $height: Float!
  ) {
    createUser(
      input: {
        username: $username
        first_name: $first_name
        last_name: $last_name
        DOB: $DOB
        sex: $sex
        height: $height
      }
    ) {
      id
      username
      createdAt
    }
  }
`;

const createNewStepCount = gql`
  mutation($step_count: String!, $metrics: AnalyicsStatus!) {
    createStepCount(input: { step_count: $step_count, metrics: $metric }) {
      id
    }
  }
`;

const createNewHeartRate = gql`
  mutation($heart_rate: String!, $metrics: AnalyicsStatus!) {
    createHeartRate(input: { heart_rate: $heart_rate, metrics: $metrics }) {
      id
    }
  }
`;

const createNewBloodOxygen = gql`
  mutation($blood_oxygen: String!, $metrics: AnalyicsStatus!) {
    createBloodOxygen(
      input: { blood_oxygen: $blood_oxygen, metrics: $metric }
    ) {
      id
    }
  }
`;

const createNewAnalytics = gql`
  mutation(
    $userID: ID!
    $date_recorded: AWSDateTime!
    $stepCountID: ID!
    $heartRateID: ID!
    $bloodOxygenID: ID!
  ) {
    createAnalytics(
      input: {
        userID: $userID
        date_recorded: $date_recorded
        stepCountID: $stepCountID
        heartRateID: $heartRateID
        bloodOxygenID: $bloodOxygenID
      }
    ) {
      id
    }
  }
`;

//Queries

const userByEmail = gql`
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
      items {
        id
        email
        first_name
        last_name
        DOB
        sex
        height
      }
    }
  }
`;

const getUserInfo = gql`
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
      items {
        id
        analytics {
          items {
            date_recorded
            stepCount {
              step_count
            }
            heartRate {
              heart_rate
            }
            bloodOxygen {
              blood_oxygen
            }
          }
        }
      }
    }
  }
`;

export {
  userByEmail,
  getUserInfo,
  createNewStepCount,
  createNewBloodOxygen,
  createNewHeartRate,
  createNewAnalytics,
};
