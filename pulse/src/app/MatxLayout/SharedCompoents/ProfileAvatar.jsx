import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  avatar: {
    // color: theme.palette.getContrastText(cyan[800]),
    // backgroundColor: cyan[800],
    // width: theme.spacing(8),
    // height: theme.spacing(8),
    boxShadow: "1px 3px 4px black",
  },
}));

const ProfileAvatar = (props) => {
  const classes = useStyles();

  return (
    <Avatar className={classes.avatar}>
      {props.pic ? (
        <img alt={props.altText} src={props.pic} />
      ) : (
        props.altComponent
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
