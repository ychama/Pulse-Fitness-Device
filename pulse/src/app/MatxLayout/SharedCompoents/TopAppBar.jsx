import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Auth, Storage } from "aws-amplify";

import {
  makeStyles,
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
  Icon,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { MatxMenu } from "matx";
import AppContext from "../../appContext";
import AvatarClickable from "./AvatarClickable";
import defaultImage from "./image/default.png";
import "./style.css";
import authRoles, { getUserRole } from "../../auth/authRoles";
import userRoutes from "../../views/user/UserRoutes";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingRight: 24,
    color: "#ffffff",
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
    fontSize: 24,
  },
  avatar: {
    boxShadow: "1px 5px 10px black",
  },
}));

const TopAppBar = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [pic, setPic] = useState("");
  const [homeRoute, setHomeRoute] = useState("/");
  const [profileRoute, setProfileRoute] = useState("/");

  const getUrlPathName = () => new URL(document.location.href).pathname;
  const { user, setUser, refreshAuth, setRefreshAuth } = useContext(AppContext);
  console.log("App context", AppContext);

  const getPageTitle = (routes) => {
    try {
      const urlPathName = getUrlPathName();
      const pageName = routes.filter((attr) => attr.path === urlPathName)[0]
        .name;
      return pageName;
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    if (user) {
      let roleRoutes = [];
      roleRoutes = userRoutes;
      setHomeRoute(
        roleRoutes.filter((item) => item.hasOwnProperty("home"))[0].path
      );

      setProfileRoute(
        roleRoutes.filter((item) => item.name === "Profile")[0].path
      );
    }
  }, [user]);

  const homeButtonHandler = () => {
    history.push(homeRoute);
  };
  const handleSignOut = () => {
    localStorage.removeItem("currentUserInfo");
    setUser(null);
    setRefreshAuth(!refreshAuth);
    Auth.signOut().then(() => history.push("/session/signin"));
  };
  useEffect(() => {
    if (user && "pic" in user && user.pic !== null) {
      Storage.get(user.pic)
        .then((pic) => {
          setPic(pic);
        })
        .catch((error) => console.log("Error getting user pic: ", error));
    }
  }, [user]);

  return (
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Tooltip title="Home">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="go home"
            onClick={() => homeButtonHandler()}
            className={classes.menuButton}
          >
            <Home fontSize="large" />
          </IconButton>
        </Tooltip>
        <Typography
          component="div"
          variant="body1"
          noWrap
          className={classes.title}
        >
          {getPageTitle(props.routes)}
        </Typography>

        <div className="flex flex-middle">
          <MatxMenu
            menuButton={
              <IconButton color="inherit">
                {user && user.name ? (
                  <AvatarClickable
                    alt={`${user.name[0]}-profile-pic`}
                    src={pic}
                  />
                ) : (
                  <AvatarClickable alt={defaultImage} src={defaultImage} />
                )}
              </IconButton>
            }
          >
            <MenuItem
              style={{ minWidth: 185 }}
              onClick={() => {
                history.push(profileRoute);
              }}
            >
              <Icon> person </Icon>
              <span className="pl-16"> Profile </span>
            </MenuItem>
            <MenuItem
              onClick={handleSignOut}
              className="flex flex-middle"
              style={{ minWidth: 185 }}
            >
              <Icon> power_settings_new </Icon>
              <span className="pl-16"> Sign Out </span>
            </MenuItem>
          </MatxMenu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
