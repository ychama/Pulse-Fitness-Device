import React from "react";
import {
  makeStyles,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DropdownSelector = (props) => {
  const { setSelectedItem, selectedItem, selections, helperText } = props;
  const classes = useStyles();

  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <Select
        value={selectedItem}
        onChange={handleChange}
        displayEmpty
        className={classes.selectEmpty}
        inputProps={{ "aria-label": "Without label" }}
        IconComponent={Add}
      >
        {selections.map((item, index) => (
          <MenuItem key={index} disabled={item.enabled} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default DropdownSelector;

DropdownSelector.defaultProps = {
  helperText: null,
};
