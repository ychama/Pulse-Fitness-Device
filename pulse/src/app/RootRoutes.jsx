import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import sessionRoutes from "./views/sessions/SessionRoutes";
import userRoutes from "./views/user/UserRoutes";
import { Auth } from "aws-amplify";

function RedirectComponent() {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => setAuthenticated(false));
  }, []);
  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <Redirect to="/session/signin" />
  );
}

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: RedirectComponent,
  },
];

const errorRoute = [
  {
    component: () => <Redirect to="/session/404" />,
  },
];

const routes = [
  ...sessionRoutes,
  ...userRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
