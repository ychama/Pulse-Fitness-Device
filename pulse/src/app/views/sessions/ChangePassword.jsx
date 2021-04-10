import React, { useState } from "react";
import { Card, Grid, Button } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import TextField from "../shared/TextField";
import TextButton from "../shared/TextButton";

const ChangePassword = (props) => {
  const history = useHistory();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [
    confirmPasswordErrorMessage,
    setConfirmPasswordErrorMessage,
  ] = useState("");

  const handleChangePassword = async () => {
    try {
      if (confirmPassword === newPassword) {
        const passReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,14}$/;
        if (!newPassword.match(passReg)) {
          setNewPasswordErrorMessage(
            "Password must have at least 1 digit, 1 lower case letter, 1 upper case letter. Password must be between 8 to 14 characters."
          );
        } else {
          const currentUser = await Auth.currentAuthenticatedUser();
          await Auth.changePassword(
            currentUser,
            currentUser.attributes["custom:temporaryPassword"],
            newPassword
          );
          console.log("change password");
          await Auth.updateUserAttributes(currentUser, {
            "custom:temporaryPassword": "",
          });
          console.log("update attribute");
          localStorage.clear();
          props.history.push("/session/signin");
          return;
        }
      } else {
        setConfirmPasswordErrorMessage("Passwords are not equal");
      }
    } catch (e) {
      console.log("error in change password", e);
      setNewPasswordErrorMessage("Server error!");
    }
  };

  return (
    <div className="signup flex flex-center w-100 h-100vh">
      <div className="p-8">
        <Card className="signup-card position-relative y-center">
          <Grid container>
            <Grid item lg={5} md={5} sm={5} xs={12}>
              <div className="p-32 flex flex-center flex-middle h-100">
                <img src="/assets/images/vidkids-logo-main.png" alt="logo" />
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
                      label="New Password"
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setNewPasswordErrorMessage("");
                      }}
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
                      type="password"
                      name="confirm-password"
                      value={confirmPassword}
                      errorMessage={confirmPasswordErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex" }}>
                    <TextButton onClick={history.goBack}>Back</TextButton>
                    <div style={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleChangePassword}
                    >
                      Change Password
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

export default ChangePassword;
