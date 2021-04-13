import React from "react";
import { makeStyles, Paper, Grid } from "@material-ui/core";
import classnames from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    maxHeight: "100%",
    width: "100%",
    maxWidth: "100%",
    overflow: "auto",
    borderRadius: 8,
  },
  gridContainer: {
    height: "100%",
    maxHeight: "100%",
    width: "100%",
    maxWidth: "100%",
    overflowY: "auto",
  },
  gridRowOne: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    maxHeight: "100%",
    width: "100%",
    maxWidth: "100%",
  },
  gridCell: {
    padding: 12,
  },
  startCallButtonContainer: {
    height: 150,
    width: 200,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    "&:hover, &:focus": {
      boxShadow:
        "0px 3px 5px -1px rgba(0, 0, 0, 0.06), 0px 6px 10px 0px rgba(0, 0, 0, 0.042), 0px 1px 18px 0px rgba(0, 0, 0, 0.03)",
      transform: "translateY(-0.25em)",
      cursor: "pointer",
    },
    backgroundColor: "#f5f5f5",
  },
  startCallIcon: {
    height: 100,
    width: 100,
  },
  startCallButtonLabel: {
    ...theme.typography.button,
    padding: theme.spacing(1),
  },
}));

const CallBoxNotLive = (props) => {
  const classes = useStyles();

  return (
    <Paper elevation={5} className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classnames(classes.gridContainer, classes.gridCell)}
      >
        <Grid
          item
          xs={12}
          className={classnames(classes.gridRowOne, classes.gridCell)}
        >
          <Paper
            elevation={7}
            className={classes.startCallButtonContainer}
            onClick={() => props.setIsCallLive(true)}
          >
            <div className={classes.startCallIcon}>
              <img
                src="/assets/images/video-call-icon.png"
                alt="video-call-icon"
              />
            </div>
            <div className={classes.startCallButtonLabel}>Join the Call</div>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CallBoxNotLive;
