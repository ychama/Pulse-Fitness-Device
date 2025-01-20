import React, { useEffect, useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import moment from "moment";
import API, { graphqlOperation } from "@aws-amplify/api";
import TotalStepsWalked from "./TotalStepsWalked";
import AverageHeartRate from "./AverageHeartRate";
import AverageBloodOxygen from "./AverageBloodOxygen";
import Barchart from "./BarChart";
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
  const [stepsTaken, setStepsTaken] = useState([0, 0, 0, 0, 0]);

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  useEffect(() => {
    if (dates.length > 0) {
      getStats();
    }
  }, [analyticsData, dates]);

  useEffect(() => {
    setUpWeeks();
  }, []);

  const setUpWeeks = () => {
    let weeks = [];

    for (let i = 1; i < 30; i += 7) {
      if (i < 10) weeks.push(year + "-0" + month + "-0" + i + "T08:00:00.000Z");
      else weeks.push(year + "-0" + month + "-" + i + "T00:00:00.000Z");
    }
    setDates(weeks);
  };

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
    analyticsData.map((data, key) => {
      whatWeekIsItIn(data);
    });
  };

  const whatWeekIsItIn = (item) => {
    let stepList = [...stepsTaken];
    for (let i = 0; i < dates.length; i++) {
      let weekAtI = moment(dates[i]);
      let inputDate = moment(item.data.date_recorded);
      console.log(weekAtI);
      console.log(inputDate);
      console.log(stepList);
      if (weekAtI.isoWeek() === inputDate.isoWeek()) {
        let temp = stepList[i];
        console.log(i);
        stepList[i] = temp + parseInt(item.data["heartRate"], 10);

        break;
      }
    }
    setStepsTaken(stepList);
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
      <Grid item xs={12} className={classes.containerPadding}>
        <Barchart stepsTaken={stepsTaken} dates={dates} />
      </Grid>
    </Grid>
  );
};
export default Graphs;
