import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setLayoutSettings } from "../../redux/actions/LayoutActions";

import { Helmet } from "react-helmet";

const MatxTheme = (props) => {
  const { children, settings } = props;
  const activeTheme = { ...settings.themes[settings.activeTheme] };

  return (
    <MuiThemeProvider theme={activeTheme}>
      <Helmet>
        <style>
          {`
              :root {
                --font: "Libre Franklin", Roboto,"Helvetica Neue",sans-serif;
                --font-caption: 400 12px/20px var(--font);
                --font-body-1: 400 14px/20px var(--font);
                --font-body-2: 500 14px/24px var(--font);
                --font-subheading-1: 400 15px/24px var(--font);
                --font-subheading-2: 400 16px/28px var(--font);
                --font-headline: 400 24px/32px var(--font);
                --font-title: 500 18px/26px var(--font);
                --font-display-1: 400 34px/40px var(--font);
                --font-display-2: 400 45px/48px var(--font);
                --font-display-3: 400 56px/56px var(--font);
                --font-display-4: 300 112px/112px var(--font);
                
                ${activeTheme.shadows
                  .map((shadow, i) => `--elevation-z${i}: ${shadow};`)
                  .join(" ")} 

              }
            `}
        </style>
      </Helmet>

      {children}
    </MuiThemeProvider>
  );
};

MatxTheme.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  settings: state.layout.settings,
  setLayoutSettings: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { setLayoutSettings })(MatxTheme);
