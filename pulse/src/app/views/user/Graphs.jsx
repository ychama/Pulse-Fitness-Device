import React, { useEffect, useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import moment from "moment";
import API, { graphqlOperation } from "@aws-amplify/api";
import TotalStepsWalked from "./TotalStepsWalked";
import AverageHeartRate from "./AverageHeartRate";
import AverageBloodOxygen from "./AverageBloodOxygen";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  containerPadding: {
    padding: 12,
  },
}));

const Graphs = (props) => {
  const classes = useStyles();
  const { analyticsData } = props;
  const [totalStepsWalked, setTotalStepsWalked] = useState(0);
  const [averageHeartRate, setAverageHeartRate] = useState(0);
  const [averageBloodOxygen, setAverageBloodOxygen] = useState(0);
  const [dates, setDates] = useState([]);

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  useEffect(() => {
    getStats();
  }, [analyticsData]);

  //   useEffect(() => {
  //     if (dates) {
  //     }
  //   }, [dates]);

  const getStats = () => {
    let stepsWalked = 0;
    let hr = 0;
    let bl = 0;
    console.log(analyticsData);
    analyticsData.map((data, key) => {
      stepsWalked += parseInt(data.data["steps"], 10);
      hr += parseInt(data.data["heartRate"], 10);
      bl += parseInt(data.data["oxygenLevel"], 10);
    });
    hr = hr / analyticsData.length;
    bl = bl / analyticsData.length;
    setAverageBloodOxygen(bl);
    setAverageHeartRate(hr);
    setTotalStepsWalked(stepsWalked);
  };

  const setUpWeeks = () => {
    let weeks = [];

    for (let i = 1; i < 30; i += 7) {
      if (i < 10) weeks.push(year + "-" + month + "-0" + i + "T08:00:00.285Z");
      else weeks.push(year + "-" + month + "-" + i + "T00:00:00.285Z");
    }
    setDates(weeks);
  };
  return (
    <Grid container>
      {" "}
      <Grid
        item
        // lg={3}
        // sm={6}
        // xl={3}
        xs={4}
        className={classes.containerPadding}
      >
        <TotalStepsWalked
          totalStepsWalked={totalStepsWalked}
        ></TotalStepsWalked>
      </Grid>
      <Grid
        item
        // lg={3}
        // sm={6}
        // xl={3}
        xs={4}
        className={classes.containerPadding}
      >
        <AverageHeartRate
          averageHeartRate={averageHeartRate}
        ></AverageHeartRate>
      </Grid>
      <Grid
        item
        // lg={3}
        // sm={6}
        // xl={3}
        xs={4}
        className={classes.containerPadding}
      >
        <AverageBloodOxygen
          averageBloodOxygen={averageBloodOxygen}
        ></AverageBloodOxygen>
      </Grid>
    </Grid>
  );
};
export default Graphs;
