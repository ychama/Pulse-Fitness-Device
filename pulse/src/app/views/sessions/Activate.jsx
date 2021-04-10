import React, { Component } from "react";
import { Card, Grid, Button } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { Auth } from "aws-amplify";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AlertTitle from "@material-ui/lab/AlertTitle";

class Activate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      showActivateErrorMessage: false,
      activateErrorMessage: "",
    };
  }

  handleFormSubmit = (event) => {
    Auth.confirmSignUp(
      this.props.location.state.username,
      this.state.activationCode
    )
      .then(() => {
        this.props.history.push();
        console.log("successful singup for user ");
        this.props.history.push("/session/signIn");
      })
      .catch((e) => {
        this.setState({
          activateErrorMessage: e.message,
          showActivateErrorMessage: true,
        });
        console.log("error on singup.", e);
        this.forceUpdate();
      });
  };

  handleChange = (event) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    let { activationCode } = this.state;
    return (
      <div className="activate flex flex-center w-100 h-100vh">
        <div className="p-8">
          <Card className="activate-card position-relative y-center">
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="p-32 flex flex-center flex-middle h-120">
                  <img src="/assets/images/illustrations/2.svg" alt="" />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="p-36 h-100 bg-light-gray position-relative">
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="mb-24 w-100"
                      variant="outlined"
                      label="Activation code"
                      type="text"
                      onChange={this.handleChange}
                      name="activationCode"
                      value={activationCode}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <div className="flex flex-middle mb-8">
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Activate
                        </Button>
                      </div>
                    </div>
                    {/* //todo make this is a component*/}
                    <Collapse in={this.state.showActivateErrorMessage}>
                      <Alert
                        variant="outlined"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              this.setState({
                                showActivateErrorMessage: false,
                              });
                              this.forceUpdate();
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        severity="error"
                      >
                        <AlertTitle>Error</AlertTitle>
                        {this.state.activateErrorMessage}
                      </Alert>
                    </Collapse>
                  </ValidatorForm>
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(Activate);
