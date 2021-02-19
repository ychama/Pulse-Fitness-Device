import React from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';

import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SimpleForm from '../../../app/views/material-kit/forms/SimpleForm';

export default function FormButton(props) {
  const {
    color, add, title, id,
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const icon = add ? (
    <PostAddIcon
      id="noteIcon"
      onClick={() => handleClickOpen()}
      fontSize="large"
      style={{ color }}
    />
  ) : (
    <ListAltIcon id="noteIcon" fontSize="large" style={{ color }} />
  );
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        container={() => document.getElementById('forms-parent')}
      >
        <DialogTitle id="form-dialog-title">Add note</DialogTitle>
        <DialogContent>
          <SimpleForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton aria-label="note">
        <InputLabel htmlFor="noteIcon">{title}</InputLabel>
        {icon}
      </IconButton>
    </div>
  );
}
