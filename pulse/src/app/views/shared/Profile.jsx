import React, { useState, useEffect, useContext } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { Auth, Storage } from "aws-amplify";
import API from "@aws-amplify/api";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useHistory } from "react-router-dom";
import { Edit } from "@material-ui/icons";
import Compress from "compress.js";
import MuiAlert from "@material-ui/lab/Alert";
import * as mutations from "../../../graphql/mutations";
import Paper from "./Paper";
import TextField from "./TextField";
import VidKidsMainLogo from "../../MatxLayout/SharedCompoents/VidKidsMainLogo";
import TextButton from "./TextButton";
import AvatarClickable from "../../MatxLayout/SharedCompoents/AvatarClickable";
import AppContext from "../../appContext";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  gridContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(112, 212, 236, 0.1)",
  },
  paper: {
    maxWidth: "450px",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    border: "none",
    padding: "24px",
  },
  editButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    position: "absolute",
  },
}));

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const resizeImage = async (file) => {
  const compress = new Compress();
  const resizedImage = await compress.compress([file], {
    size: 2, // the max size in MB, defaults to 2MB
    quality: 1,
    maxWidth: 300,
    maxHeight: 300,
    resize: true,
  });
  const img = resizedImage[0];
  const base64str = img.data;
  const imgExt = img.ext;
  const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt);
  return resizedFiile;
};

const ProfileCard = (props) => {
  const { classes, title, user, alert } = props;
  const { setAlertMessage, setAlertMessageSeverity } = alert;
  const [hover, setHover] = useState(false);
  const [pic, setPic] = useState("");
  const [name, setName] = useState(user.name);

  const handlePicUpload = (event) => {
    const originalFileName = event.target.files[0];
    resizeImage(event.target.files[0]).then((file) => {
      const fileName = `${user.username}-${originalFileName.name}`;
      Storage.put(fileName, file, { contentType: "image/png" })
        .then((resp) => {
          setPic(URL.createObjectURL(file));
          API.graphql({
            query: mutations.updateUser,
            variables: { input: { id: user.id, pic: fileName } },
          }).catch((error) => {
            console.log("-----> error saving pic url for user ", user, error);
          });
        })
        .catch((error) => console.log("---> error setting the picture", error));
    });
  };

  const changeName = () => {
    API.graphql({
      query: mutations.updateUser,
      variables: { input: { id: user.id, name } },
    })
      .then(() => {
        setAlertMessage("Saved new name!");
        setAlertMessageSeverity("success");
      })
      .catch((error) => {
        setAlertMessage("Error updating your name!");
        setAlertMessageSeverity("error");
        console.error("Failed to update user's name", error);
      });
  };

  useEffect(() => {
    if ("pic" in user && user.pic !== null) {
      Storage.get(user.pic)
        .then((_pic) => {
          setPic(_pic);
        })
        .catch((error) => console.log("Error getting user pic: ", error));
    }
  }, [user]);

  return (
    <Paper elevation={5} variant="outlined" className={classes.paper}>
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="stretch"
        style={{ backgroundColor: "white", borderRadius: "8px" }}
      >
        <Grid item style={{ textAlign: "center" }}>
          <Typography
            component="p"
            variant="body1"
            style={{ fontWeight: "bold" }}
          >
            {title} Information
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            backgroundColor: "white",
            height: "100px",
          }}
        >
          <input
            color="primary"
            accept="image/*"
            type="file"
            onChange={handlePicUpload}
            id="icon-button-file-user"
            style={{ display: "none", height: "100%", padding: "0" }}
          />
          <label htmlFor="icon-button-file-user" style={{ height: "100%" }}>
            <IconButton
              component="div"
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
              style={{
                height: "fit-content",
                width: "fit-content",
                padding: "0",
              }}
            >
              <AvatarClickable
                alt={user.name ? `${user.name[0]}-` : "?"}
                src={pic}
                size={60}
              />
              <Edit
                color="primary"
                style={{
                  position: "absolute",
                  display: hover ? "block" : "none",
                  color: "#2C9FFA",
                  backgroundColor: "white",
                  borderRadius: "15px",
                }}
              />
            </IconButton>
          </label>
        </Grid>
        <Grid item xs={12} style={{ backgroundColor: "white" }}>
          <TextField
            label="Name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            value={name}
            type="text"
            name="name"
            errorMessage=""
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ position: "relative" }}>
            <TextField
              label="Email"
              onChange={(event) => {}}
              fullWidth
              name="email"
              type="email"
              variant="filled"
              disabled
              value={user.email}
              errorMessage=""
            />
          </div>
        </Grid>
        <Grid item xs={12} style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }} />
          <Button variant="contained" color="primary" onClick={changeName}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const BabyCard = (props) => {
  const { classes, user, alert } = props;
  const [hover, setHover] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(user.babyDOB));
  const [babyName, setBabyName] = useState(user.babyName);
  const [babyNameErrorMessage, setBabyNameErrorMessage] = useState("");
  const [babyPic, setBabyPic] = useState("");
  const { setAlertMessage, setAlertMessageSeverity } = alert;

  const handleBabyPicUpload = (event) => {
    resizeImage(event.target.files[0]).then((file) => {
      const fileName = `${user.username}-baby-${file.name}`;
      Storage.put(fileName, file, { contentType: "image/png" })
        .then((resp) => {
          setBabyPic(URL.createObjectURL(file));
          API.graphql({
            query: mutations.updateUser,
            variables: { input: { id: user.id, babyPic: fileName } },
          }).catch((error) => {
            console.log(
              "-----> error saving baby pic url for user ",
              user,
              error
            );
          });
        })
        .catch((error) =>
          console.log("---> error setting the baby pic", error)
        );
    });
  };

  useEffect(() => {
    if ("babyPic" in user && user.babyPic !== null) {
      Storage.get(user.babyPic)
        .then((_pic) => {
          setBabyPic(_pic);
        })
        .catch((error) => console.log("Error getting user baby pic: ", error));
    }
  }, [user]);

  const changeNameAndDoB = () => {
    API.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: user.id,
          babyName,
          babyDOB: selectedDate.toISOString().substring(0, 10),
        },
      },
    })
      .then(() => {
        setAlertMessage("Saved new name!");
        setAlertMessageSeverity("success");
      })
      .catch((error) => {
        setAlertMessage("Error updating your name!");
        setAlertMessageSeverity("error");
        console.error("Failed to update user's name", error);
      });
  };

  return (
    <Paper elevation={5} variant="outlined" className={classes.paper}>
      <Grid container spacing={3} direction="column" alignItems="stretch">
        <Grid item style={{ textAlign: "center" }}>
          <Typography
            component="p"
            variant="body1"
            style={{ fontWeight: "bold" }}
          >
            Baby Information
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100px",
          }}
        >
          <input
            color="primary"
            accept="image/*"
            type="file"
            onChange={handleBabyPicUpload}
            id="icon-button-file-baby"
            style={{ display: "none", height: "100%", padding: "0" }}
          />
          <label htmlFor="icon-button-file-baby" style={{ height: "100%" }}>
            <IconButton
              component="span"
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
              style={{ height: "100%", width: "100%", padding: "0" }}
            >
              <AvatarClickable
                alt={`${user.babyName[0]}-profile-pic`}
                src={babyPic}
                size={60}
              />
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                style={{
                  position: "absolute",
                  display: hover ? "block" : "none",
                  backgroundColor: "white",
                }}
              >
                <Edit />
              </IconButton>
            </IconButton>
          </label>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Name"
            onChange={(event) => {
              setBabyName(event.target.value);
              setBabyNameErrorMessage("");
            }}
            value={babyName}
            type="text"
            name="Baby name"
            errorMessage={babyNameErrorMessage}
          />
        </Grid>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              variant="outlined"
              margin="normal"
              id="date-picker-dialog"
              label="Date of Birth"
              format="MM/dd/yyyy"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            onClick={changeNameAndDoB}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const PasswordCard = (props) => {
  const { classes, user, alert } = props;
  const { setAlertMessage, setAlertMessageSeverity } = alert;

  const history = useHistory();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [
    currentPasswordErrorMessage,
    setCurrentPasswordErrorMessage,
  ] = useState("");
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");

  const handleForgotPassword = () => {
    history.push("/session/forgot-password", { email: user.email });
  };

  const changePassword = async () => {
    if (currentPassword === "") {
      setCurrentPasswordErrorMessage("Enter your current password.");
    } else if (confirmPassword === newPassword) {
      const passReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,14}$/;
      if (!newPassword.match(passReg)) {
        setNewPasswordErrorMessage(
          "Password must have at least 1 digit, 1 lower case letter, 1 upper case letter. Password must be between 8 to 14 characters."
        );
      } else {
        const currentUser = await Auth.currentAuthenticatedUser();
        Auth.changePassword(currentUser, currentPassword, newPassword)
          .then(() => {
            setAlertMessage("Password changed!");
            setAlertMessageSeverity("success");
          })
          .catch((error) => {
            console.log("error on change password", error);
            setCurrentPasswordErrorMessage("Current password is incorrect.");
          });
        return;
      }
    } else {
      setConfirmErrorMessage("Passwords do not match");
    }
  };
  return (
    <Paper elevation={5} variant="outlined" className={classes.paper}>
      <Grid container spacing={3} direction="column" alignItems="stretch">
        <Grid item style={{ textAlign: "center" }}>
          <Typography
            component="p"
            variant="body1"
            style={{ fontWeight: "bold" }}
          >
            Change Password
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Current Password"
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setCurrentPasswordErrorMessage("");
            }}
            value={currentPassword}
            type="password"
            name="current"
            errorMessage={currentPasswordErrorMessage}
            InputProps={{
              endAdornment: (
                <TextButton onClick={handleForgotPassword} size="small">
                  Forgot?
                </TextButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ position: "relative" }}>
            <TextField
              label="New Password"
              onChange={(event) => {
                setNewPassword(event.target.value);
                setNewPasswordErrorMessage("");
              }}
              value={newPassword}
              fullWidth
              name="new"
              type="password"
              errorMessage={newPasswordErrorMessage}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ position: "relative" }}>
            <TextField
              label="Confirm Password"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setConfirmErrorMessage("");
              }}
              value={confirmPassword}
              fullWidth
              name="confirm"
              type="password"
              errorMessage={confirmErrorMessage}
            />
          </div>
        </Grid>
        <Grid item xs={12} style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }} />
          <Button variant="contained" color="primary" onClick={changePassword}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

// const ParentLayout = ({ classes, user, alert }) => (
//   <>
//     <Grid
//       item
//       md={6}
//       xs={12}
//       style={{ display: "flex", justifyContent: "center" }}
//     >
//       <ProfileCard classes={classes} title="Parent" user={user} alert={alert} />
//     </Grid>

//     <Grid
//       item
//       md={6}
//       xs={12}
//       style={{ display: "flex", justifyContent: "center" }}
//     >
//       <BabyCard classes={classes} user={user} alert={alert} />
//     </Grid>

//     <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
//       <PasswordCard classes={classes} user={user} alert={alert} />
//     </Grid>
//   </>
// );

const NonParentLayout = ({ classes, user, alert }) => (
  <>
    <Grid
      item
      md={6}
      xs={12}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <ProfileCard
        classes={classes}
        title="Profile"
        user={user}
        alert={alert}
      />
    </Grid>

    <Grid
      item
      md={6}
      xs={12}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <PasswordCard classes={classes} user={user} alert={alert} />
    </Grid>
  </>
);

const Profile = () => {
  const classes = useStyles();

  const context = useContext(AppContext);
  const { user } = context;
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessageSeverity, setAlertMessageSeverity] = useState("success");

  const Content = (props) => (
    <>
      <ParentLayout classes={classes} user={user} alert={props.alert} />
    </>
  );

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems="center"
        spacing={0}
        className={classes.gridContainer}
      >
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <VidKidsMainLogo width={200} />
        </Grid>
        {user == null ? (
          <CircularProgress />
        ) : (
          <Content
            alert={{
              setAlertMessage,
              setAlertMessageSeverity,
            }}
          />
        )}
      </Grid>
      <Snackbar
        open={alertMessage !== ""}
        autoHideDuration={6000}
        onClose={() => {
          setAlertMessage("");
        }}
      >
        <Alert
          onClose={() => {
            setAlertMessage("");
          }}
          severity={alertMessageSeverity}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
