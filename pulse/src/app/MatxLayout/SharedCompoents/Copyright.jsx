import React from 'react';
import { makeStyles, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footerContainer: {
    width: '100%',
    height: '100%',
    // paddingTop: 40,
    // paddingBottom: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Copyright = () => {
  const classes = useStyles();

  return (
    <div className={classes.footerContainer}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Aranite Inc.
        </Link>
        {' '}
        {new Date().getFullYear()}
        .
      </Typography>
    </div>
  );
};

export default Copyright;
