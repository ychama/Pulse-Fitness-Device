import React, { useState, useEffect, useContext } from "react";
import { Card, Grid, Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import TextButton from "../shared/TextButton";
import authRoles from "../../auth/authRoles";
import TextField from "../shared/TextField";
import AppContext from "../../appContext";

const SignIn = (props) => {
  const { history } = props;

  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const { refreshAuth, setRefreshAuth } = useContext(AppContext);

  const clearErrors = () => {
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
  };

  const redirect = () => {
    const currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
    if (localStorage.getItem("lastLocation") != null) {
      const lastLocation = localStorage.getItem("lastLocation");
      localStorage.removeItem("lastLocation");
      history.push(lastLocation);
      return;
    }
    history.push("/dashboard");
  };

  const handleForgotPassword = async () => {
    history.push("/session/forgot-password", { email });
  };

  const handleRegister = async () => {
    history.push("/session/register");
  };

  const handleSignin = () => {
    const validationData = new Map();
    if (!email) {
      setEmailErrorMessage("Email is required");
    } else if (!password) {
      setPasswordErrorMessage("Password field is required");
    } else {
      Auth.signIn({ username: email, password }, validationData)
        .then((resp) => {
          Auth.currentUserInfo().then((currentUserInfo) => {
            if (currentUserInfo) {
              setRefreshAuth(!refreshAuth);
              localStorage.setItem(
                "currentUserInfo",
                JSON.stringify(currentUserInfo)
              );
              console.log(currentUserInfo);
              redirect();
            } else {
              console.error("--------> received null user!");
            }
          });
        })
        .catch((error) => {
          //console.log("error on login", error);
          if ((error.code = "UserNotConfirmedException")) {
            console.log("user not found");
            history.push("/session/activate", { email });
          } else {
            setEmailErrorMessage("Incorrect email or password");
            setPasswordErrorMessage("Incorrect email or password");
          }
        });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("currentUserInfo") !== null) {
      redirect();
    }
  });

  return (
    <div
      className="signup flex flex-center w-100 h-100vh"
      style={{ backgroundColor: "rgba(112, 212, 236, 0.1)" }}
    >
      <div className="p-8">
        <Card
          className="signup-card position-relative y-center"
          style={{
            boxShadow:
              "0px 5px 5px -3px rgba(0, 0, 0, 0.06), 0px 8px 10px 1px rgba(0, 0, 0, 0.042), 0px 3px 14px 2px rgba(0, 0, 0, 0.036)",
          }}
        >
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
                      label="Email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearErrors();
                      }}
                      value={email}
                      type="email"
                      name="email"
                      errorMessage={emailErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearErrors();
                      }}
                      fullWidth
                      name="password"
                      type="password"
                      value={password}
                      errorMessage={passwordErrorMessage}
                      InputProps={{
                        endAdornment: (
                          <TextButton
                            onClick={handleForgotPassword}
                            size="small"
                          >
                            Forgot?
                          </TextButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid container item spacing={1}>
                    <Grid item xs>
                      <div style={{ flexGrow: 1 }} />
                      <TextButton onClick={handleRegister}>Register</TextButton>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex" }}>
                      <div style={{ flexGrow: 1 }} />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSignin}
                      >
                        Sign In
                      </Button>
                    </Grid>
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

export default withRouter(SignIn);
