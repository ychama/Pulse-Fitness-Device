import React, { useEffect, useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import moment from "moment";
import API, { graphqlOperation } from "@aws-amplify/api";
import TotalStepsWalked from "./TotalStepsWalked";
import AverageHeartRate from "./AverageHeartRate";
import AverageBloodOxygen from "./AverageBloodOxygen";
import Barchart from "./BarChart";
import LineChartHeartRate from "./LineChartHeartRate";
import LineChartBloodOxygen from "./LineChartBloodOxygen";
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
  const [heartRate, setHeartRate] = useState([0, 0, 0, 0, 0]);
  // const [heartRateCounter, setHeartRateCounter] = useState([0, 0, 0, 0, 0]);
  const [bloodOxygen, setBloodOxygen] = useState([0, 0, 0, 0, 0]);

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
    let i = 0;
    analyticsData.map((data, key) => {
      stepsWalked += parseInt(data.data["steps"], 10);
      hr += parseInt(data.data["heartRate"], 10);

      if (parseInt(data.data["oxygenLevel"], 10) > 0) {
        i++;
        bl += parseInt(data.data["oxygenLevel"], 10);
      }
    });
    hr = hr / analyticsData.length;
    bl = bl / i;
    setAverageBloodOxygen(bl);
    setAverageHeartRate(hr);
    setTotalStepsWalked(stepsWalked);
    let stepList = [...stepsTaken];
    let heartRateList = [...heartRate];
    let bloodOxygenList = [...bloodOxygen];
    let heartRateCounterList = [0, 0, 0, 0, 0];
    let bloodOxygenCounterList = [0, 0, 0, 0, 0];
    analyticsData.map(async (data, key) => {
      await whatWeekIsItIn(
        data,
        stepList,
        heartRateList,
        bloodOxygenList,
        bloodOxygenCounterList,
        heartRateCounterList
      );
    });
    setStepsTaken(stepList);
    for (let i = 0; i < heartRateCounterList.length; i++) {
      let count = heartRateCounterList[i];
      if (count > 0) {
        console.log(heartRateList[i]);
        let avHr = Math.round(heartRateList[i] / count, 1);
        heartRateList[i] = avHr;
      }
    }
    setHeartRate(heartRateList);
    for (let i = 0; i < bloodOxygenCounterList.length; i++) {
      let count = bloodOxygenCounterList[i];
      if (count > 0) {
        let avHr = Math.round(bloodOxygenList[i] / count, 1);
        bloodOxygenList[i] = avHr;
      }
    }
    setBloodOxygen(bloodOxygenList);
  };

  const whatWeekIsItIn = async (
    item,
    stepList,
    heartRateList,
    bloodOxygenList,
    bloodOxygenCounterList,
    heartRateCounterList
  ) => {
    for (let i = 0; i < dates.length; i++) {
      let weekAtI = moment(dates[i]);
      let inputDate = moment(item.data.date_recorded);
      if (weekAtI.isoWeek() === inputDate.isoWeek()) {
        heartRateCounterList[i]++;
        let temp = stepList[i];
        stepList[i] = temp + parseInt(item.data["steps"], 10);
        let temp1 = heartRateList[i];
        heartRateList[i] = temp1 + parseInt(item.data["heartRate"], 10);
        if (parseInt(item.data["oxygenLevel"], 10) > 0) {
          bloodOxygenCounterList[i]++;
          let temp3 = bloodOxygenList[i];
          bloodOxygenList[i] = temp3 + parseInt(item.data["oxygenLevel"], 10);
        }

        break;
      }
    }
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
      <Grid item xs={12} className={classes.containerPadding}>
        <LineChartHeartRate stepsTaken={heartRate} dates={dates} />
      </Grid>
      <Grid item xs={12} className={classes.containerPadding}>
        <LineChartBloodOxygen stepsTaken={bloodOxygen} dates={dates} />
      </Grid>
    </Grid>
  );
};
export default Graphs;
