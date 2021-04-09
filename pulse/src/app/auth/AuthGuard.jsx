import React, { useContext, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import AppContext from "app/appContext";
import API, { graphqlOperation } from "@aws-amplify/api";
import { userByEmail } from "app/graphql";
import * as subscriptions from "../../graphql/subscriptions";

const AuthGuard = (props) => {
  const { location, history, children } = props;
  const { pathname } = location;
  const { routes, setUser, refreshAuth } = useContext(AppContext);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let currentUserInfo = JSON.parse(localStorage.getItem("currentUserInfo"));
    if (currentUserInfo) {
      API.graphql(
        graphqlOperation(userByEmail, {
          email: currentUserInfo.attributes.email,
        })
      )
        .then((resp) => {
          if (resp.data.userByEmail.items.length > 0) {
            const userData = resp.data.userByEmail.items[0];
            console.log(userData);
            setUser({
              ...currentUserInfo,
              ...userData,
            });
          }
        })
        .catch((error) => {
          console.error("Error in fetching user info", error);
        });
    }
  }, [refreshAuth]);

  useEffect(() => {
    if (!authenticated) {
      localStorage.setItem("lastLocation", props.location.pathname);
      history.push("/session/signin");
    }
  }, [props]);

  useEffect(() => {
    const currentUserInfo = localStorage.getItem("currentUserInfo");
    const userRole = JSON.parse(currentUserInfo);
    const matched = routes.find((r) => r.path === pathname);
    setAuthenticated(true);

    // if (matched && matched.auth && matched.auth.length) {
    //   if (!matched.auth.includes(userRole?.attributes["custom:role"])) {
    //     history.push("/session/404");
    //   }
    // }
  }, [routes]);

  return authenticated ? <>{children}</> : null;
};

export default withRouter(AuthGuard);
