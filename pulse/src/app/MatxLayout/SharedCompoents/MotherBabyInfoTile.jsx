import React, { useState, useEffect } from "react";
import API, { graphqlOperation } from "@aws-amplify/api";
import { Storage } from "aws-amplify";
import moment from "moment";
import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import AvatarClickable from "./AvatarClickable";
import ProfileAvatarDescriptor from "./ProfileAvatarDescriptor";
import { getMomDetails } from "../../graphql";

const MotherBabyInfoTile = (props) => {
  const {
    meetingId,
    parentId,
    parentProfilePicture,
    parentName,
    studyId,
    babyProfilePicture,
    babyName,
    babyAge,
    visitType,
    studyCaseType,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [parentPicUrl, setParentPicUrl] = useState(null);
  const [babyPicUrl, setBabyPicUrl] = useState(null);
  const [nextMeeting, setNextMeeting] = useState(null);

  useEffect(() => {
    if (parentId) {
      fetchNextMeeting();
    }
  }, [parentId]);

  useEffect(() => {
    if (parentProfilePicture) {
      Storage.get(parentProfilePicture)
          .then((pic) => {
            setParentPicUrl(pic);
          })
          .catch((error) => console.log("Error getting user pic: ", error));
    }
  }, [parentProfilePicture]);

  useEffect(() => {
    if (babyProfilePicture) {
      Storage.get(babyProfilePicture)
          .then((pic) => {
            setBabyPicUrl(pic);
          })
          .catch((error) => console.log("Error getting user pic: ", error));
    }
  }, [parentProfilePicture]);

  const fetchNextMeeting = async () => {
    try {
      const response = await API.graphql(
          graphqlOperation(getMomDetails, { id: parentId })
      );

      const meetingsList =
          response.data.getUser.studyCaseRoles.items[0].studyCase.meetings.items;

      const formattedMeetingsList = meetingsList.map((meeting) => {
        meeting.startTimeFormatted = moment(meeting.startTime).format(
            "YYYY-MM-DD hh:mm a"
        );
        meeting.startTimeSortFormatted = moment(meeting.startTime).format(
            "YYYYMMDDHHmm"
        );
        return meeting;
      });

      const meetingsListSorted = formattedMeetingsList
          .sort((a, b) => b.startTimeSortFormatted - a.startTimeSortFormatted)
          .reverse();

      const thisMeeting = formattedMeetingsList.find(
          (meeting) => meeting.id === meetingId
      );

      const indexOfThisMeeting = meetingsListSorted.indexOf(thisMeeting);

      let nextMeeting = null;
      try {
        if (indexOfThisMeeting === meetingsListSorted.length - 1) {
          nextMeeting = "No more visits scheduled";
        } else {
          nextMeeting = meetingsListSorted[indexOfThisMeeting + 1];
        }
      } catch {
        nextMeeting = meetingsListSorted.slice(-1);
      }

      if (nextMeeting.startTime) {
        setNextMeeting(nextMeeting.startTimeFormatted);
      } else {
        setNextMeeting(nextMeeting);
      }
    } catch (error) {
      console.log("Error fetching parent information", error);
    }
  };


  return  (
      <div style={{ width: "100%", height: "100%" }}>
        <Grid container spacing={1}>
          <Grid
              container
              item
              xs={6}
              spacing={1}
              justify={isMobile ? "flex-start" : "center"}
              alignItems="flex-start"
          >
            <Grid container item xs={12}>
              {!isMobile ? (
                  <Grid item xs={4}>
                    <AvatarClickable
                        alt={
                          parentName
                              ? `${parentName[0]}-profile-pic`
                              : "default-profile-pic"
                        }
                        src={parentPicUrl}
                        size={70}
                    />
                  </Grid>
              ) : null}
              <Grid item xs={isMobile ? 12 : 8}>
                <ProfileAvatarDescriptor
                    userName={parentName}
                    visitType={visitType}
                    descriptor={studyId}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
              container
              item
              xs={6}
              spacing={1}
              justify={isMobile ? "flex-start" : "center"}
              alignItems="flex-start"
          >
            <Grid container item xs={12}>
              {!isMobile ? (
                  <Grid item xs={4}>
                    <AvatarClickable
                        alt={
                          babyName
                              ? `${babyName[0]}-profile-pic`
                              : "default-profile-pic"
                        }
                        src={babyPicUrl}
                        size={70}
                    />
                  </Grid>
              ) : null}
              <Grid item xs={isMobile ? 12 : 8}>
                <ProfileAvatarDescriptor
                    userName={babyName}
                    descriptor={babyAge}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              width: "100%",
            }}
        >
          <Typography variant="subtitle1">{studyCaseType} </Typography>
          {!isMobile ? (
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                Next visit:
              </Typography>
          ) : null}
          <Typography variant="subtitle1" style={{ marginLeft: "4px" }}>
            {nextMeeting}
          </Typography>
        </div>
      </div>
  );
};

export default MotherBabyInfoTile;
