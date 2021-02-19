import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, Paper } from "@material-ui/core";
import DrawerButton from "./DrawerButton";

import AppContext from "../../appContext";
import authRoles, { getUserRole } from "../../auth/authRoles";

export const drawerWidth = "86px";

const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    width: drawerWidth,
    height: "100vh",
    padding: "30px 0",
    backgroundColor: "#2e9efa30",
  },
  drawerList: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
}));

const Drawer = () => {
  const classes = useStyles();
  const history = useHistory();

  const [drawerItems, setDrawerItems] = useState([]);
  const [roleRoutes, setRoleRoutes] = useState([]);

  const { user } = useContext(AppContext);

  // useEffect(() => {
  //   if (user) {
  //     switch (getUserRole(user.type, user.staffType)) {
  //       case authRoles.nurse:
  //         setRoleRoutes(nurseRoutes);
  //         break;
  //       case authRoles.mother:
  //         setRoleRoutes(motherRoutes);
  //         break;
  //       case authRoles.assistant:
  //         setRoleRoutes(assistantRoutes);
  //         break;
  //       case authRoles.sa:
  //         setRoleRoutes(adminRoutes);
  //         break;
  //       case authRoles.coder:
  //         setRoleRoutes(coderRoutes);
  //         break;
  //     }
  //   }
  // }, [user]);

  useEffect(() => {
    setDrawerItems(
      roleRoutes.filter((item) => item.hasOwnProperty("sidebarIcon"))
    );
  }, [roleRoutes]);

  const changePageHandler = (pageName) => {
    history.push(roleRoutes.find((route) => route.name === pageName).path);
  };

  return (
    <Paper elevation={5} className={classes.drawerContainer}>
      <div className={classes.drawerList}>
        {drawerItems.map((item, index) => (
          <DrawerButton
            key={index}
            label={item.name}
            icon={item.sidebarIcon}
            clickHandler={() => changePageHandler(item.name)}
          />
        ))}
      </div>
    </Paper>
  );
};

export default Drawer;
