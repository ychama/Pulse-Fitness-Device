import React, { useState } from "react";
import CallBoxLive from "./CallBoxLive";
import CallBoxNotLive from "./CallBoxNotLive";

const CallBox = (props) => {
  const {
    role,
    meetingId,
    toggleFullScreen,
    scheduleNextVisit,
    endCall,
    isCallLive,
    setIsCallLive,
  } = props;

  return (
    <>
      {isCallLive ? (
        <CallBoxLive
          role={role}
          meetingId={meetingId}
          toggleFullScreen={toggleFullScreen}
          scheduleNextVisit={scheduleNextVisit}
          endCall={endCall}
        />
      ) : (
        <CallBoxNotLive setIsCallLive={setIsCallLive} />
      )}
    </>
  );
};
export default CallBox;
