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
import TextButton from "../shared/TextButton";
import { Auth } from "aws-amplify";
import { ContactSupportTwoTone } from "@material-ui/icons";

const ActivateUser = (props) => {
  const { history } = props;
  const username = props.location.state.email;
  const [activationCode, setActivationCode] = useState("");
  const [activationCodeErrorMessage, setActivationCodeErrorMessage] = useState(
    ""
  );
  console.log(username);

  const handleActivate = () => {
    Auth.confirmSignUp(username, activationCode)
      .then(() => {
        history.push();
        console.log("successful singup for user ");
        history.push("/session/signIn");
      })
      .catch((e) => {
        setActivationCodeErrorMessage("Invalid Activation Code");
        console.log("error on singup.", e);
      });
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
                      label="Activation Code"
                      onChange={(event) => {
                        setActivationCode(event.target.value);
                        setActivationCodeErrorMessage("");
                      }}
                      value={activationCode}
                      fullWidth
                      type="text"
                      name="activate"
                      error={activationCodeErrorMessage !== ""}
                      helperText={activationCodeErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex" }}>
                    <TextButton onClick={history.goBack}>Back</TextButton>
                    <div style={{ flexGrow: 1 }} />
                    <Button
                      onClick={handleActivate}
                      variant="contained"
                      color="primary"
                    >
                      Activate
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

export default ActivateUser;
