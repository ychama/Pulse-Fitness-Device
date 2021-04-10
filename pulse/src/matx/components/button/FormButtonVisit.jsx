import React, { useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import NoteIcon from '@material-ui/icons/Note';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import API from '@aws-amplify/api';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {
  Checkbox, FormControlLabel, Grid, Icon, Radio, RadioGroup,
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SimpleFormButton from '../../../app/views/material-kit/forms/SimpleFormButton';
import * as mutations from '../../../graphql/mutations';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
  },

  container: {
    // alignItems: 'baseline',
    // maxWidth: '70%',
    // maxHeight: '30%',
    // position: 'relative'
    // anchorPosition: {left:'570' ,top:'550'}
  },

  textBox: {
    width: '100%',
  },
}));

export default function FormButtonVisit(props) {
  const {
    color, add, id, meetingId, visitType, studyCase, changed,
  } = props;
  const classes = useStyles();
  const inputCaption = props.caption;
  const inputContent = props.content;
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickView = () => {
    console.log(inputContent);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    const createdNote = API.graphql({
      query: mutations.createNote,
      variables: {
        input: {
          content,
          meetingId,
          visitType,
          studyCase,
        },
      },
    });
    createdNote.then(() => {
      console.log('Note is created');
      changed();
      setOpen(false);
    });
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
    <div className={classes.root}>
      <Dialog
        open={open}
        classes={{ container: classes.container }}
        onClose={handleClose}
        fullScreen
        fullWidth
        style={{ position: 'absolute' }}
        maxWidth="md-6"
        aria-labelledby="form-dialog-title"
        container={() => document.getElementById('forms-parent-answer')}
      >
        <DialogTitle id="form-dialog-title">Add Form</DialogTitle>
        <DialogContent>
          <SimpleFormButton />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            close
          </Button>
          {add === true && (
            <Button onClick={handleAdd} color="primary">
              Add
              {' '}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <IconButton aria-label="note">
        <br />
        <InputLabel htmlFor="noteIcon">{inputCaption}</InputLabel>
        {icon}
      </IconButton>
    </div>
  );
}
