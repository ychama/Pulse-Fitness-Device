import React from "react";
import AppContext from "../../appContext";
import { renderRoutes } from "react-router-config";
import { makeStyles, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import Drawer from "./../SharedCompoents/Drawer";
import TopAppBar from "../SharedCompoents/TopAppBar";
import { drawerWidth } from "./../SharedCompoents/Drawer";

export const headerHeight = "64px";
export const rowPadding = "24px";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    maxHeight: "100vh",
    width: "100vw",
    maxWidth: "100vw",
  },
  gridRowOne: {
    maxHeight: headerHeight,
    flex: `0 0 ${headerHeight}`,
  },
  gridRowTwo: {
    flex: "1",
  },
  drawer: {
    flex: `0 0 ${drawerWidth}`,
  },
  mainContent: {
    flex: "1",
    height: `calc(100vh - ${headerHeight})`,
    maxHeight: `calc(100vh - ${headerHeight})`,
  },
}));

const Layout1 = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getUrlPathName = () => {
    return new URL(document.location.href).pathname;
  };

  const showToolbars = () => {
    const urlPathName = getUrlPathName();
    if (urlPathName.startsWith("session", 1)) {
      return false;
    }
    return true;
  };

  return (
    <AppContext.Consumer>
      {({ routes }) => (
        <div className={classes.root}>
          {showToolbars(routes) ? (
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12} className={classes.gridRowOne}>
                <TopAppBar routes={routes} />
              </Grid>
              <Grid
                item
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                xs={12}
                className={classes.gridRowTwo}
              >
                {isMobile ? null : (
                  <Grid item className={classes.drawer}>
                    <Drawer />
                  </Grid>
                )}
                <Grid item container className={classes.mainContent}>
                  {renderRoutes(routes)}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            renderRoutes(routes)
          )}
        </div>
      )}
    </AppContext.Consumer>
  );
};

export default Layout1;
