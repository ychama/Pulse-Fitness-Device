const textLight = {
  // primary: "rgba(255, 255, 255, 1)",
  // primary: "rgba(106 113 115, 0)",
  // primary: "rgba(105, 112, 115, 1)",
  primary: "rgba(105, 112, 115, 1)",
  secondary: "rgba(74, 70, 109, 0.54)",
  disabled: "rgba(74, 70, 109, 0.38)",
  hint: "rgba(74, 70, 109, 0.38)",
};

const themeColors = {
  white: {
    palette: {
      type: "light",
      primary: {
        main: "#ffffff",
        contrastText: textLight.primary,
      },
      secondary: {
        main: "#2d9efa",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  slateDark1: {
    palette: {
      type: "dark",
      primary: {
        main: "#5a4af7",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#6fd4eb",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  slateDark2: {
    palette: {
      type: "dark",
      primary: {
        main: "#1a2038",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#6fd4eb",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  purple1: {
    palette: {
      type: "light",
      primary: {
        main: "#2d9efa",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#6fd4eb",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  purple2: {
    palette: {
      type: "light",
      primary: {
        main: "#6a75c9",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#6fd4eb",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  purpleDark1: {
    palette: {
      type: "dark",
      primary: {
        main: "#2d9efa",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  purpleDark2: {
    palette: {
      type: "dark",
      primary: {
        main: "#6a75c9",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  blue: {
    palette: {
      type: "light",
      primary: {
        main: "#2C9FFA",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#E6F6FA",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  blueDark: {
    palette: {
      type: "dark",
      primary: {
        main: "#3366FF",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FF4F30",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  red: {
    palette: {
      type: "dark",
      primary: {
        main: "#e53935",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FFAF38",
        contrastText: textLight.primary,
      },
    },
  },
  pulse: {
    palette: {
      type: "light",
      primary: {
        main: "#1AAAD8",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#6fd4eb",
        contrastText: {
          primary: "#ffffff",
          secondary: "#ffffff",
          disabled: "#ffffff",
          hint: "#ffffff",
        },
      },
      text: {
        primary: "rgba(105, 112, 115, 1)",
        secondary: "rgba(74, 70, 109, 0.54)",
        disabled: "rgba(74, 70, 109, 0.38)",
        hint: "rgba(74, 70, 109, 0.38)",
      },
    },
  },
};

export default themeColors;
