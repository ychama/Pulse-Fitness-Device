import React, { useState } from "react";
import { Card, Grid, Button, makeStyles, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import TextButton from "../shared/TextButton";
import { resetPassword } from "../../redux/actions/LoginActions";

const useStyles = makeStyles({
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
});

const ForgotPassword = (props) => {
  const classes = useStyles();
  const { history } = props;

  let inputEmail = "";
  try {
    inputEmail = props.location.state.email;
  } catch (e) {}

  const [email, setEmail] = useState(inputEmail);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const clearErrors = () => {
    setEmailErrorMessage("");
  };

  const handleResetPassword = async () => {
    resetPassword({ email });
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
                      label="Email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearErrors();
                      }}
                      value={email}
                      fullWidth
                      type="text"
                      name="email"
                      error={emailErrorMessage !== ""}
                      helperText={emailErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex" }}>
                    <TextButton onClick={history.goBack}>Back</TextButton>
                    <div style={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleResetPassword}
                    >
                      Reset Password
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

export default withRouter(ForgotPassword);
