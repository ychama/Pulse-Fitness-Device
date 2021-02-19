import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import sessionRoutes from "./views/sessions/SessionRoutes";

function RedirectComponent() {
  const [authenticated, setAuthenticated] = useState(false);

  return <Redirect to="/session/signin" />;
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

const routes = [...sessionRoutes, ...redirectRoute, ...errorRoute];

export default routes;
