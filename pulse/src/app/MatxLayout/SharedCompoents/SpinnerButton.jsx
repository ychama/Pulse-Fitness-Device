import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    position: "relative",
    backgroundColor: theme.primary,
    "&:hover": {
      backgroundColor: "rgb(30, 111, 175)",
    },
  },
  buttonProgress: {
    color: "rgb(30, 111, 175)",
    position: "absolute",
  },
}));

export default function SpinnerButton(props) {
  const { buttonText, handleClick } = props;

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();

  const buttonClassName = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 3000);
      handleClick();
    }
  };

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        className={buttonClassName}
        disabled={loading}
        onClick={handleButtonClick}
      >
        {buttonText}
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </Button>
    </div>
  );
}
