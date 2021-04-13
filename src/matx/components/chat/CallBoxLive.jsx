import React from "react";
import Jitsi from "./Jitsi";

const CallBox = (props) => (
  <Jitsi
    key="nurse-mom-room"
    domain="video-vidkids.aranite.com"
    jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImRjOVB3eHQvYVNndmdBPT0iLCJzdWIiOiJ2aWRlby12aWRraWRzLmFyYW5pdGUuY29tIiwicm9vbSI6IioiLCJleHAiOjE1MDAwMDY5MjN9.wEdhb9HUkIqiWbyNBM2M0CsijeosISdHENEWkjYe4iM"
    interfaceConfig={{
      TOOLBAR_BUTTONS: [],
      SHOW_CHROME_EXTENSION_BANNER: false,
      DISABLE_FOCUS_INDICATOR: true,
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    }}
    toggleFullScreen={props.toggleFullScreen}
    scheduleNextVisit={props.scheduleNextVisit}
    endCall={props.endCall}
    roomName={props.meetingId}
    role={props.role}
  />
);
export default CallBox;
