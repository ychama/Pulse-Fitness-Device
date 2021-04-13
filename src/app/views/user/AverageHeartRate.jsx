import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    borderRadius: 8,
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.06), 0px 5px 8px 0px rgba(0, 0, 0, 0.042), 0px 1px 14px 0px rgba(0, 0, 0, 0.036)",
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56,
  },
}));

const AverageHeartRate = (props, { className, ...rest }) => {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Average Heart Rate
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {Math.round(props.averageHeartRate, 1)}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <FavoriteIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

AverageHeartRate.propTypes = {
  className: PropTypes.string,
};
export default AverageHeartRate;
