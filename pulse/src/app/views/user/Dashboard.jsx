import React, { useEffect, useState, useContext } from "react";
import API, { graphqlOperation } from "@aws-amplify/api";
import PulseMainLogo from "../../MatxLayout/SharedCompoents/PulseMainLogo";
import classnames from "classnames";
import AppContext from "../../appContext";
import { makeStyles, Grid, Container } from "@material-ui/core";
import * as mutations from "../../../graphql/mutations";
import {
  getUserInfo,
  createNewStepCount,
  createNewBloodOxygen,
  createNewHeartRate,
  createNewAnalytics,
} from "../../graphql.js";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "ffffff",
    height: "100%",
    maxHeight: "100%",
    width: "100%",
    maxWidth: "100%",
  },
  rootContainer: {
    height: "100%",
    maxHeight: "100%",
  },
  gridContainer: {
    height: "100%",
    maxHeight: "100%",
  },
  gridCell: {
    padding: 12,
  },
  gridRowOne: {
    flex: "0 0 150px",
    maxHeight: 150,
  },
  gridRowTwo: {
    flex: "1",
    overflowY: "auto",
    paddingBottom: "24px",
  },
}));

const Dashboard = () => {
  const { user } = useContext(AppContext);
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(true);
  const [heartRate, setHeartRate] = useState(null);
  const [dataRead, setDataRead] = useState([]);
  // const [heartRateID, setHeartRateID] = useState(null);
  // const [bloodOxygenID, setBloodOxygenID] = useState(null);
  // const [stepsID, setStepsID] = useState(null);

  const readings = [];
  const prevReadingsLen = readings.length;

  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    if (navigator.bluetooth) {
      setSupportsBluetooth(true);
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      console.log(user.email);
      getUser(user.email);
    }
  }, [user]);

  const getUser = async (email) => {
    API.graphql(graphqlOperation(getUserInfo, { email: email })).then((res) => {
      //Latest Analytics
      console.log(res);
    });
  };

  useEffect(() => {
    console.log(dataRead.length);
    if (isDisconnected && dataRead.length) {
      //sending data to backend
      //call getUser again to update the graphs
      updateUserAnalytics();
    }
  }, [isDisconnected, dataRead]);

  const updateUserAnalytics = async () => {
    dataRead.forEach((reading, key) => {
      reading.forEach(async (element, key) => {
        var heartRate = element.hr;
        var bloodOxygen = element.oL;
        var steps = element.st;
        var date = element.dt;
        console.log(date);

        const createHeartRate = {
          heart_rate: String(heartRate),
          metrics: "NORMAL",
        };
        const createBloodOxygen = {
          blood_oxygen: String(bloodOxygen),
          metrics: "NORMAL",
        };
        const createStepCount = {
          step_count: String(steps),
          metrics: "NORMAL",
        };
        console.log(createHeartRate);
        console.log(createBloodOxygen);
        console.log(createStepCount);
        const heartRateResponse = await API.graphql({
          query: mutations.createHeartRate,
          variables: { input: createHeartRate },
        });
        const bloodOxygenResponse = await API.graphql({
          query: mutations.createBloodOxygen,
          variables: { input: createBloodOxygen },
        });
        const stepsResponse = await API.graphql({
          query: mutations.createStepCount,
          variables: { input: createStepCount },
        });

        console.log(bloodOxygenResponse.data.createBloodOxygen["id"]);
        console.log(heartRateResponse.data.createHeartRate["id"]);
        console.log(stepsResponse.data.createStepCount["id"]);

        const stepID = stepsResponse.data.createStepCount["id"];
        const hrID = heartRateResponse.data.createHeartRate["id"];
        const olID = bloodOxygenResponse.data.createBloodOxygen["id"];
        const userID = user.id;

        //const createAnalytics = {};

        const analyticsResponse = await API.graphql({
          query: mutations.createAnalytics,
          variables: {
            input: {
              userID: userID,
              date_recorded: date,
              stepCountID: stepID,
              heartRateID: hrID,
              bloodOxygenID: olID,
            },
          },
        });
        console.log(analyticsResponse);
      });
    });
  };

  /**
   * Let the user know when their device has been disconnected.
   */
  const onDisconnected = (event) => {
    alert(`The device ${event.target} is disconnected`);
    setIsDisconnected(true);
  };

  /**
   * Update the value shown on the web page when a notification is
   * received.
   */
  const handleCharacteristicValueChanged = (event) => {
    var temp = event.target.value;
    var temp1 = new TextDecoder("utf-8").decode(temp);
    var jsonData = JSON.parse(temp1);
    setDataRead((arr) => [...arr, jsonData]);

    //setHeartRate(event.target.value.getUint8(0) + "%");
  };

  /**
   * Attempts to connect to a Bluetooth device and subscribe to
   * battery level readings using the battery service.
   */
  const connectToDeviceAndSubscribeToUpdates = async () => {
    try {
      //Search for Bluetooth devices that advertise a battery service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["739f9f96-8a7b-11eb-8dcd-0242ac130003"] }],
      });

      setIsDisconnected(false);

      // Add an event listener to detect when a device disconnects
      device.addEventListener("gattserverdisconnected", onDisconnected);

      // Try to connect to the remote GATT Server running on the Bluetooth device
      const server = await device.gatt.connect();
      console.log(server);
      // Get the battery service from the Bluetooth device
      const service = await server.getPrimaryService(
        "739f9f96-8a7b-11eb-8dcd-0242ac130003"
      );

      console.log(service);

      // Get the battery level characteristic from the Bluetooth device
      const characteristic = await service.getCharacteristic(
        "69567fb9-cba3-41db-a8e4-84e951fefdfe"
      );

      // Subscribe to battery level notifications
      characteristic.startNotifications();

      // When the battery level changes, call a function
      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );

      // Read the battery level value
      const reading = await characteristic.readValue();

      console.log("There was a reading", reading);
      var temp = new TextDecoder("utf-8").decode(reading);

      var jsonData = JSON.parse(temp);

      setDataRead((arr) => [...arr, jsonData]);

      // Show the initial reading on the web page
      setHeartRate(reading.getUint8(0));
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="lg" className={classes.rootContainer}>
        <Grid
          item
          container
          direction="column"
          className={classes.gridContainer}
        >
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            xs={12}
            className={classnames(classes.gridCell, classes.gridRowOne)}
          >
            <PulseMainLogo width={200} />
            {supportsBluetooth && !isDisconnected && (
              <p>HeartRate: {heartRate}</p>
            )}
            {supportsBluetooth && isDisconnected && (
              <button onClick={connectToDeviceAndSubscribeToUpdates}>
                Connect to a Bluetooth device
              </button>
            )}
            {!supportsBluetooth && (
              <p>This browser doesn't support the Web Bluetooth API</p>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
