import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Bar, Line } from "react-chartjs-2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.06), 0px 5px 8px 0px rgba(0, 0, 0, 0.042), 0px 1px 14px 0px rgba(0, 0, 0, 0.036)",
  },
}));

const LineChartHeartRate = (props, { className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { stepsTaken, dates } = props;
  const [formatedDateArr, setFormatedDateArr] = useState([]);

  useEffect(() => {
    if (stepsTaken != null) setProperDates();
  }, [stepsTaken]);

  const setProperDates = () => {
    let properDate = [];

    dates.forEach((date) => {
      properDate.push(moment(date).format("MMM DD"));
    });
    setFormatedDateArr(properDate);
  };

  const data = {
    datasets: [
      {
        backgroundColor: colors.red[500],
        //fill: false,
        //borderColor: colors.red[500],
        data: stepsTaken,
        label: "Heart Rate",
      },
    ],
    labels: formatedDateArr,
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Heart Rate" />
      <Divider />
      <CardContent>
        <Box height={400} position="relative">
          <Line data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

LineChartHeartRate.propTypes = {
  className: PropTypes.string,
};

export default LineChartHeartRate;
