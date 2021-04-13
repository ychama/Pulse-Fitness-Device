import API, { graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../../graphql/mutations";
import { getStudyCaseMeeting } from "../graphql";

export const meetingService = {
  async getMeetings() {
    return null;
  },

  async scheduleMeeting(
    nurseId,
    motherId,
    studyCaseId,
    visitType,
    startDate,
    setNotificationMessage,
    setNotificationSeverity,
    callback = () => {}
  ) {
    API.graphql(graphqlOperation(getStudyCaseMeeting, { studyCaseId }))
      .then((meetings) => {
        const existingMeeting = meetings.data.listMeetings.items.filter(
          (meeting) => {
            return meeting.visitType === visitType;
          }
        );
        if (existingMeeting && existingMeeting.length !== 0) {
          // Update the current meeting
          const updateMeetingData = {
            id: existingMeeting[0].id,
            status: "NEW",
            startTime: startDate,
          };
          API.graphql({
            query: mutations.updateMeeting,
            variables: { input: updateMeetingData },
          })
            .then(() => {
              setNotificationSeverity("success");
              setNotificationMessage("Visit updated!");
              callback();
            })
            .catch((error) => {
              setNotificationSeverity("error");
              setNotificationMessage("Visit update failed!");
              callback();
              console.log("-----> send update error message", error);
            });
        } else {
          // Create new meeting
          const createMeetingData = {
            studyCaseID: studyCaseId,
            starterID: nurseId,
            visitType: visitType,
            status: "NEW",
            attenderID: motherId,
            startTime: startDate,
          };
          API.graphql({
            query: mutations.createMeeting,
            variables: { input: createMeetingData },
          })
            .then(() => {
              setNotificationSeverity("success");
              setNotificationMessage("Visit created!");
              callback();
            })
            .catch((error) => {
              setNotificationSeverity("error");
              setNotificationMessage("Visit creation failed!");
              callback();
              console.log("-----> send create error message", error);
            });
        }
      })
      .catch((error) => {
        console.log("-----> send global error message", error);
        setNotificationSeverity("error");
        setNotificationMessage("Server error!");
        callback();
      });
  },
};

export default meetingService;
