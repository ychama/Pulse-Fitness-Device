import { IconButton, Tooltip, CircularProgress } from "@material-ui/core";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  RadioButtonChecked,
  Fullscreen,
  CalendarToday,
  CallEnd,
} from "@material-ui/icons";

import React, { useState, useEffect, useRef } from "react";

const importJitsiApi = () =>
  new Promise(async (resolve) => {
    if (window.JitsiMeetExternalAPI) {
      resolve(window.JitsiMeetExternalAPI);
    } else {
      const head = document.getElementsByTagName("head")[0];
      const script = document.createElement("script");

      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", "https://meet.jit.si/external_api.js");

      head.addEventListener(
        "load",
        (event) => {
          if (event.target.nodeName === "SCRIPT") {
            resolve(window.JitsiMeetExternalAPI);
          }
        },
        true
      );

      head.appendChild(script);
    }
  });

const Props = {
  domain: "video-vidkids.aranite.com",
  roomName: (Math.random() + 0.48151642).toString(36).substring(2),
};

const DefaultLoader = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      backgroundColor: "#474747",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    }}
  >
    <CircularProgress />
  </div>
);

const ContainerStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
};

const FrameStyle = (loading) => ({
  display: loading ? "none" : "block",
  width: "100%",
  flexGrow: 1,
});

const Jitsi = (props) => {
  const {
    loadingComponent,
    onIframeLoad,
    domain,
    roomName,
    displayName,
    config,
    interfaceConfig,
    noSSL,
    jwt,
    devices,
    userInfo,
    scheduleNextVisit,
    endCall,
    role,
  } = { ...Props, ...props };

  const [loading, setLoading] = useState(true);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [recording, setRecording] = useState(false);
  const ref = useRef(null);

  const Loader = loadingComponent || DefaultLoader;

  const [japi, setJAPI] = useState();

  const startConference = (JitsiMeetExternalAPI) => {
    try {
      const options = {
        roomName,
        parentNode: ref.current,
        configOverwrite: config,
        interfaceConfigOverwrite: interfaceConfig,
        noSSL,
        jwt,
        onLoad: onIframeLoad,
        devices,
        userInfo,
      };

      const api = new JitsiMeetExternalAPI(domain, options);

      if (!api)
        throw new Error("Failed to create JitsiMeetExternalAPI istance");

      api.on("videoConferenceJoined", () => {
        setLoading(false);

        api.executeCommand("displayName", displayName);
      });
      api.on("readyToClose", () => {
        endCall();
      });
      setJAPI(api);

      /// **
      // * If we are on a self hosted Jitsi domain, we need to become moderators before setting a password
      // * Issue: https://community.jitsi.org/t/lock-failed-on-jitsimeetexternalapi/32060
      // */
      // api.addEventListener("participantRoleChanged", (e) => {
      //  if (e.role === "moderator") api.executeCommand("password", password);
      // });
    } catch (error) {
      console.error("Failed to start the conference", error);
    }
  };

  const ParentControls = () => (
    <>
      <div style={{ flexGrow: 1 }} />

      <Tooltip title="Toggle Audio">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            japi.executeCommand("toggleAudio");
            setAudio(!audio);
          }}
        >
          {!audio ? <Mic /> : <MicOff />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Video">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            japi.executeCommand("toggleVideo");
            setVideo(!video);
          }}
        >
          {!video ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Leave Call">
        <IconButton
          variant="contained"
          style={{
            color: "white",
            backgroundColor: "red",
            width: "35px",
            height: "35px",
          }}
          onClick={() => {
            japi.executeCommand("hangup");
          }}
        >
          <CallEnd size="small" />
        </IconButton>
      </Tooltip>
      <div style={{ flexGrow: 1 }} />
    </>
  );

  const NurseControls = () => (
    <>
      <Tooltip title="Share Screen">
        <IconButton
          aria-label="share screen"
          component="span"
          style={{ color: "white" }}
          onClick={() => {
            japi.executeCommand("toggleShareScreen");
          }}
        >
          <ScreenShare />
        </IconButton>
      </Tooltip>
      <Tooltip title="Schedule New Visit">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            scheduleNextVisit(true);
          }}
        >
          <CalendarToday />
        </IconButton>
      </Tooltip>
      <div style={{ flexGrow: 1 }} />

      <Tooltip title="Toggle Audio">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            japi.executeCommand("toggleAudio");
            setAudio(!audio);
          }}
        >
          {!audio ? <Mic /> : <MicOff />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Video">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            japi.executeCommand("toggleVideo");
            setVideo(!video);
          }}
        >
          {!video ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Leave Call">
        <IconButton
          variant="contained"
          style={{
            color: "white",
            backgroundColor: "red",
            width: "35px",
            height: "35px",
          }}
          onClick={() => {
            japi.executeCommand("hangup");
          }}
        >
          <CallEnd size="small" />
        </IconButton>
      </Tooltip>
      <div style={{ flexGrow: 1 }} />

      <Tooltip title="Record">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            {
              recording
                ? japi.executeCommand("stopRecording", "file")
                : japi.startRecording({ mode: "file" });
            }
            setRecording(!recording);
          }}
        >
          <RadioButtonChecked />
        </IconButton>
      </Tooltip>
      <Tooltip title="Full Screen">
        <IconButton
          variant="contained"
          style={{ color: "white" }}
          onClick={() => {
            props.toggleFullScreen();
          }}
        >
          <Fullscreen />
        </IconButton>
      </Tooltip>
    </>
  );

  useEffect(() => {
    importJitsiApi()
      .then((jitsiApi) => {
        startConference(jitsiApi);
      })
      .catch((err) => {
        console.error("Jitsi Meet API library not loaded.", err);
      });
  }, []);

  return (
    <div id="react-jitsi-container" style={{ ...ContainerStyle }}>
      {loading && <Loader />}
      <div
        id="react-jitsi-frame"
        style={{ ...FrameStyle(loading) }}
        ref={ref}
      />
      <div
        style={{
          display: "flex",
          backgroundColor: "#474747",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          alignItems: "center",
        }}
      >
        {role === "NURSE" ? <NurseControls /> : <ParentControls />}
      </div>
    </div>
  );
};

export default Jitsi;
