import React from 'react';
import { TextField as MaterialTextField } from '@material-ui/core';

const TextField = (props) => {
  const { errorMessage, ...other } = props;
  return (
    <MaterialTextField
      variant="outlined"
      fullWidth
      error={errorMessage !== ''}
      helperText={errorMessage}
      {...other}
    />
  );
};

export default TextField;
