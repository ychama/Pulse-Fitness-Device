import React from "react";

const AppContext = React.createContext({
  routes: [],
  user: null,
  setUser: () => {},
});

export default AppContext;
