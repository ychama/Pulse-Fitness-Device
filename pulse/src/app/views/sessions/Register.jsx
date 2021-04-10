import React, { useState } from "react";
import {
  Card,
  Grid,
  Button,
  makeStyles,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import TextButton from "../shared/TextButton";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import API, { graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../../../graphql/mutations";
import { userByEmail } from "../../graphql";
import { Auth } from "aws-amplify";
const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const Register = (props) => {
  const classes = useStyles();
  const { history } = props;

  let inputEmail = "";

  const [email, setEmail] = useState(inputEmail);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [sex, setSex] = useState("");
  const [sexErrorMessage, setSexErrorMessage] = useState("");
  const [height, setHeight] = useState("");
  const [heightErrorMessage, setHeightErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [
    confirmPasswordErrorMessage,
    setConfirmPasswordErrorMessage,
  ] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const clearErrors = () => {
    setEmailErrorMessage("");
  };

  const formFields = [
    {
      name: "First_Name",
      value: firstName,
      setError: setFirstNameErrorMessage,
    },
    {
      name: "Last_Name",
      value: lastName,
      setError: setFirstNameErrorMessage,
    },
    {
      name: "Email",
      value: email,
      setError: setEmailErrorMessage,
    },
    {
      name: "Height",
      value: height,
      setError: setHeightErrorMessage,
    },
    {
      name: "Sex",
      value: selectedDate,
      setError: setSexErrorMessage,
    },
  ];

  const validateEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateFields = () => {
    let areAllFieldsValid = true;
    formFields.forEach((field) => {
      if (field.name == "Email") {
        if (!validateEmail()) {
          console.log("Invalid email");
          field.setError(field.name + "Invalid email");
          areAllFieldsValid = false;
        }
      } else {
        if (field.value === "") {
          console.log("Found error field", field.name, field.value);
          field.setError(field.name + "is required");
          areAllFieldsValid = false;
        }
      }
    });

    if (newPassword !== "" && confirmPassword !== "") {
      if (newPassword !== confirmPassword) {
        areAllFieldsValid = false;
        setNewPasswordErrorMessage("Password's do not match");
        setConfirmPassword("Password's do not match");
      }
    } else {
      areAllFieldsValid = false;
      setNewPasswordErrorMessage("This is required");
      setConfirmPassword("This is required");
    }

    console.log("Finished validateFields", areAllFieldsValid);
    return new Promise((resolve, reject) => {
      if (areAllFieldsValid) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  };

  const fetchExistingUser = async () => {
    let doesUserAlreadyExist = null;
    await API.graphql(
      graphqlOperation(userByEmail, {
        email: email,
      })
    )
      .then((response) => {
        console.log(response);
        if (response.data.userByEmail.items.length > 0) {
          doesUserAlreadyExist = true;
          console.log("Exists", doesUserAlreadyExist);
        } else {
          doesUserAlreadyExist = false;
          console.log("DNE", doesUserAlreadyExist);
        }
      })
      .catch((error) => {
        console.log(error, " Error occured");
      });

    return new Promise((resolve, reject) => {
      if (doesUserAlreadyExist !== null) {
        resolve(doesUserAlreadyExist);
      } else {
        reject("Error");
      }
    });
  };

  const signUpCognito = async (successMessage, errorMessage) => {
    let response;
    try {
      response = await Auth.signUp({
        username: email,
        password: newPassword,
        attributes: {
          email: email,
        },
      });
      setSignUpSuccess(true);
    } catch (error) {}
  };

  const signUp = async () => {
    const createUser = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      DOB: selectedDate.toISOString().slice(0, 10),
      sex: sex,
      height: height,
    };
    const createdUser = API.graphql({
      query: mutations.createUser,
      variables: { input: createUser },
    })
      .then((response) => {
        console.log("Sucess new user created" || createdUser);
        signUpCognito(
          "New User: " + firstName + " successfully registered",
          "Error on signup"
        );
      })
      .catch((error) => {
        console.log("error creating user ", error.errors[0].message);
      });
  };

  const handleSignUpButton = async () => {
    console.log("================================");
    console.log("First Name:", firstName);
    console.log("Email:", email);
    console.log("Date", selectedDate.toISOString().slice(0, 10));
    console.log("================================");
    const areFieldsValidated = await validateFields();
    if (areFieldsValidated) {
      const doesUserAlreadyExist = await fetchExistingUser();
      if (!doesUserAlreadyExist) {
        console.log("Are all fields validated?", areFieldsValidated);
        await signUp();
        if (signUpSuccess) {
          console.log("No errors");
          history.back();
        }
      }
    }
  };

  return (
    <div
      className="signup flex flex-center w-100 h-100vh"
      style={{ backgroundColor: "rgba(112, 212, 236, 0.1)" }}
    >
      <div className="p-8">
        <Card className="signup-card position-relative y-center">
          <Grid container>
            <Grid item lg={5} md={5} sm={5} xs={12}>
              <div className="p-32 flex flex-center flex-middle h-100">
                <img src="/assets/images/PulseLogo.png" alt="logo" />
              </div>
            </Grid>
            <Grid item lg={7} md={7} sm={7} xs={12}>
              <div
                style={{
                  marginRight: 30,
                  marginTop: 30,
                  marginBottom: 30,
                }}
              >
                <Grid
                  container
                  spacing={3}
                  direction="column"
                  alignItems="stretch"
                >
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      label="First Name"
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        setFirstNameErrorMessage("");
                      }}
                      value={firstName}
                      fullWidth
                      type="text"
                      name="fName"
                      error={firstNameErrorMessage !== ""}
                      helperText={firstNameErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      label="Last Name"
                      onChange={(event) => {
                        setLastName(event.target.value);
                        setLastNameErrorMessage("");
                      }}
                      value={lastName}
                      fullWidth
                      type="text"
                      name="lName"
                      error={emailErrorMessage !== ""}
                      helperText={emailErrorMessage}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Height (cm)"
                      onChange={(event) => {
                        setHeight(event.target.value);
                        setHeightErrorMessage("");
                      }}
                      fullWidth
                      variant="outlined"
                      type="text"
                      name="height"
                      value={height}
                      errorMessage={heightErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      label="Email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearErrors();
                      }}
                      value={email}
                      fullWidth
                      type="text"
                      name="email"
                      error={lastNameErrorMessage !== ""}
                      helperText={lastNameErrorMessage}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      variant="outlined"
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setNewPasswordErrorMessage("");
                      }}
                      fullWidth
                      value={newPassword}
                      type="password"
                      name="new-password"
                      errorMessage={newPasswordErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm Password"
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setConfirmPasswordErrorMessage("");
                      }}
                      fullWidth
                      variant="outlined"
                      type="password"
                      name="confirm-password"
                      value={confirmPassword}
                      errorMessage={confirmPasswordErrorMessage}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="new-sex-label">Sex</InputLabel>
                      <Select
                        labelId="new-sex-label"
                        id="new-sex-label"
                        value={sex}
                        onChange={(event) => {
                          setSex(event.target.value);
                        }}
                      >
                        <MenuItem value={"MALE"}>Male</MenuItem>
                        <MenuItem value={"FEMALE"}>Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={12}>
                      <KeyboardDatePicker
                        fullWidth
                        margin="normal"
                        id="date-picker-dialog"
                        label="Date of Birth"
                        format="MM/dd/yyyy"
                        maxDate={new Date()}
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  <Grid item xs={12} style={{ display: "flex" }}>
                    <TextButton onClick={history.goBack}>Back</TextButton>
                    <div style={{ flexGrow: 1 }} />
                    <Button
                      onClick={handleSignUpButton}
                      variant="contained"
                      color="primary"
                    >
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Card>
      </div>
    </div>
  );
};

export default Register;
