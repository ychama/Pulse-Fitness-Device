import React from "react";
import { makeStyles, IconButton, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  drawerItemContainer: {
    marginBottom: 35,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    overflow: "hidden",
  },
  drawerItemLabel: {},
}));

const DrawerButton = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.drawerItemContainer}>
      <IconButton onClick={props.clickHandler}>{props.icon}</IconButton>
      <Typography
        variant="p"
        className={classes.drawerItemLabel}
        variant="caption"
      >
        {props.label}
      </Typography>
    </div>
  );
};

export default DrawerButton;
