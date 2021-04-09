import { createMuiTheme } from "@material-ui/core";
import { forEach, merge } from "lodash";
import layout1Settings from "./Layout1/Layout1Settings";
import themeColors from "./MatxTheme/themeColors";
import themeOptions from "./MatxTheme/themeOptions";

function createMatxThemes() {
  const themes = {};

  forEach(themeColors, (value, key) => {
    themes[key] = createMuiTheme(merge({}, themeOptions, value));
  });
  return themes;
}
const themes = createMatxThemes();

const MatxLayoutSettings = {
  activeLayout: "layout1", // Check out Matx pro for more options
  activeTheme: "pulse", // View all valid theme colors inside MatxTheme/themeColors.js
  perfectScrollbar: true,

  themes,
  layout1Settings, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    // Check out Matx pro for secondary sidebar
    show: true,
    theme: "pulse", // View all valid theme colors inside MatxTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: true,
    fixed: false,
    theme: "pulse", // View all valid theme colors inside MatxTheme/themeColors.js
  },
};

export default MatxLayoutSettings;
