import React from "react";
import classnames from "classnames";
import { makeStyles, Avatar, IconButton, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  showShadow: {
    boxShadow: "1px 2px 4px black",
  },
  defaultColor: {
    color: "#ffffff",
    backgroundColor: "#70d4ec",
  },
}));

const AvatarClickable = (props) => {
  const {
    alt,
    src,
    clickHandler,
    showShadow,
    size,
    isIconButton,
    tooltipText,
  } = props;
  const classes = useStyles();

  if (!alt) {
    alt = "default-profile-pic";
    console.log("");
  }

  const wrapInTooltip = (element) => {
    if (tooltipText) {
      return (
        <Tooltip title={tooltipText} placement="right">
          {element}
        </Tooltip>
      );
    }
    return element;
  };

  const avatar = (
    <Avatar
      className={classnames(
        showShadow ? classes.showShadow : "",
        src ? "" : classes.defaultColor,
        classes.avatar
      )}
      style={{ width: size + "px", height: size + "px" }}
    >
      {src ? <img alt={alt} src={src} /> : alt[0]}
    </Avatar>
  );

  return (
    <>
      {isIconButton
        ? wrapInTooltip(
            <IconButton onClick={clickHandler}>{avatar}</IconButton>
          )
        : wrapInTooltip(avatar)}
    </>
  );
};

export default AvatarClickable;

AvatarClickable.defaultProps = {
  alt: "default-profile-pic", // Required
  src: null, // Optional
  clickHandler: null, // Optional
  showShadow: true, // Optional
  size: 40, // Optional
  isIconButton: false, // Optional
  tooltipText: null, // Optional
};
