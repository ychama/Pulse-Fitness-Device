import API, { graphqlOperation } from "@aws-amplify/api";
import { getMotherByName, getMothersDetail } from "../graphql";

const motherService = {
  async getMothersOfStudy(studyId) {
    const _dataSource = [];
    await API.graphql(graphqlOperation(getMothersDetail, { id: studyId })).then(
      (resp) => {
        if (resp.data.getStudy.studyCases.items.length > 0) {
          const allStudyCases = resp.data.getStudy.studyCases.items;
          let nextID = 0;
          allStudyCases.forEach((studyCase) => {
            console.log(studyCase);
            const { caseType } = studyCase;
            if (studyCase.studyCaseRoles.items.length > 0) {
              const studyCaseRoles = studyCase.studyCaseRoles.items;
              const meetings = studyCase.meetings.items;
              const caseStudyName = studyCase.hid;
              const { state } = studyCase;
              let motherName = "";
              let motherId;
              let nurseName = "";
              let nurseId = null;
              let babyBirthDate;
              let visit1 = null;
              let visit2 = null;
              let visit3 = null;
              let visit4 = null;
              studyCaseRoles.forEach((caseRole) => {
                if (caseRole.role === "MOM") {
                  motherName = caseRole.user.name;
                  motherId = caseRole.user.id;
                  babyBirthDate = caseRole.user.babyDOB;
                }
                if (caseRole.role === "NURSE") {
                  nurseName = caseRole.user.name;
                  nurseId = caseRole.user.id;
                }
              });
              meetings.forEach((meeting) => {
                switch (meeting.visitType) {
                  case "VISIT_1":
                    visit1 = meeting.startTime;
                    break;
                  case "VISIT_2":
                    visit2 = meeting.startTime;
                    break;
                  case "VISIT_3":
                    visit3 = meeting.startTime;
                    break;
                  case "VISIT_4":
                    visit4 = meeting.startTime;
                    break;
                  default:
                    break;
                }
              });
              nextID += 1;
              _dataSource.push({
                id: nextID,
                key: nextID,
                caseType,
                caseStudyName,
                state,
                motherName,
                motherId,
                babyBirthDate,
                nurseName,
                nurseId,
                visit1,
                visit2,
                visit3,
                visit4,
              });
            }
          });
        }
      }
    );
    return _dataSource;
  },

  async getMotherByName(motherName) {
    const _dataSource = [];
    await API.graphql(
      graphqlOperation(getMotherByName, { id: motherName })
    ).then((resp) => {
      if (resp.data.getStudy.studyCases.items.length > 0) {
        const allStudyCases = resp.data.getStudy.studyCases.items;
        let nextID = 0;
        allStudyCases.forEach((studyCase) => {
          const { caseType } = studyCase;
          if (studyCase.studyCaseRoles.items.length > 0) {
            const studyCaseRoles = studyCase.studyCaseRoles.items;
            const meetings = studyCase.meetings.items;
            const caseStudyName = studyCase.hid;
            const { state } = studyCase;
            let motherName = "";
            let motherId;
            let nurseName = "";
            let nurseId = null;
            let babyBirthDate;
            let visit1 = null;
            let visit2 = null;
            let visit3 = null;
            let visit4 = null;
            studyCaseRoles.forEach((caseRole) => {
              if (caseRole.role === "MOM") {
                motherName = caseRole.user.name;
                motherId = caseRole.user.id;
                babyBirthDate = caseRole.user.babyDOB;
              }
              if (caseRole.role === "NURSE") {
                nurseName = caseRole.user.name;
                nurseId = caseRole.user.id;
              }
            });
            meetings.forEach((meeting) => {
              switch (meeting.visitType) {
                case "VISIT_1":
                  visit1 = meeting.startTime;
                  break;
                case "VISIT_2":
                  visit2 = meeting.startTime;
                  break;
                case "VISIT_3":
                  visit3 = meeting.startTime;
                  break;
                case "VISIT_4":
                  visit4 = meeting.startTime;
                  break;
                default:
                  break;
              }
            });
            nextID += 1;
            _dataSource.push({
              id: nextID,
              caseType,
              caseStudyName,
              state,
              motherName,
              motherId,
              babyBirthDate,
              nurseName,
              nurseId,
              visit1,
              visit2,
              visit3,
              visit4,
            });
          }
        });
      }
    });
    console.log(_dataSource);
    return _dataSource;
  },
};

export default motherService;
