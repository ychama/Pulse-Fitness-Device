import React, { useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as constants from '../../../constants';
import NoteButton from '../button/NoteButton';
import FormButtonVisit from '../button/FormButtonVisit';

import { getMeetingNotes, getStudyCaseForms, userByUsername } from '../../../app/graphql';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function VisitDividers(props) {
  const { meetingId, visitType, studyCase } = props;
  const classes = useStyles();

  const [needChange, setNeedChange] = useState([]);
  const [notes, setNotes] = useState([]);
  const [forms, setForms] = useState([]);

  const fetchData = async () => {
    await API.graphql(graphqlOperation(getMeetingNotes, { meetingId })).then((n) => {
      setNotes(
        n.data.listNotes.items.reduce((r, a) => {
          r[a.visitType] = r[a.visitType] || [];
          r[a.visitType].push(a);
          return r;
        }, Object.create(null)),
      );
    });

    await API.graphql(graphqlOperation(getStudyCaseForms, { StudyCaseId: studyCase })).then((n) => {
      setNotes(
        n.data.listForms.items.reduce((r, a) => {
          r[a.formType] = r[a.formType] || [];
          r[a.formType].push(a);
          return r;
        }, Object.create(null)),
      );
    });
  };

  const getButtonForEmpty = function () {
    if (Array.isArray(forms) && forms.length === 0) {
      return (
        <NoteButton
          add
          changed={changeNotes}
          studycase={studyCase}
          meetingId={meetingId}
          visitType={visitType}
          color={constants.addButtonColor}
        />
      );
    }
  };

  const getFormForEmpty = function () {
    if (Array.isArray(notes) && notes.length === 0) {
      return (
        <FormButtonVisit
          add
          changed={changeNotes}
          studycase={studyCase}
          meetingId={meetingId}
          visitType={visitType}
          color={constants.addButtonColor}
        />
      );
    }
  };

  const changeNotes = function () {
    setNeedChange(!needChange);
  };

  useEffect(() => {
    fetchData();
  }, [needChange]);

  const getNoteButton = function getNotes(index, meeting) {
    if (index === 0 && meeting.visitType === visitType) {
      return [
        <NoteButton
          add
          changed={changeNotes}
          meetingId={meetingId}
          studycase={studyCase}
          visitType={meeting.visitType}
          color={constants.addButtonColor}
        />,
        <NoteButton
          key={index}
          color={constants.visitTypeColor.get(meeting.visitType)}
          caption={meeting.caption}
          content={meeting.content}
        />,
      ];
    }
    return (
      <NoteButton
        key={index}
        color={constants.visitTypeColor.get(meeting.visitType)}
        content={meeting.content}
        caption={meeting.caption}
      />
    );
  };
  const getFormButton = function getForms(index, meeting) {
    if (index === 0 && meeting.visitType === visitType) {
      return [
        <FormButtonVisit
          add
          changed={changeNotes}
          meetingId={meetingId}
          studycase={studyCase}
          visitType={meeting.visitType}
          color={constants.addButtonColor}
        />,
        <FormButtonVisit
          key={index}
          color={constants.visitTypeColor.get(meeting.visitType)}
          caption={meeting.caption}
          content={meeting.content}
        />,
      ];
    }
    return (
      <FormButtonVisit
        key={index}
        color={constants.visitTypeColor.get(meeting.visitType)}
        content={meeting.content}
        caption={meeting.caption}
      />
    );
  };

  return (
    <List>
      {Object.keys(notes).map((key) => {
        const group = [notes[key]];
        return (
          <div>
            {group.map((value, ix) => (
              <ListItem style={{ flexWrap: 'wrap' }} key={ix}>
                {value.map((v, i) => getNoteButton(i, v))}
              </ListItem>
            ))}
            <Divider variant="fullWidth" component="li" />
          </div>
        );
      })}
      {getButtonForEmpty()}
      <Divider variant="fullWidth" component="li" />

      {Object.keys(forms).map((key) => {
        const group = [forms[key]];
        return (
          <div>
            {group.map((value, ix) => (
              <ListItem style={{ flexWrap: 'wrap' }} key={ix}>
                {value.map((v, i) => getFormButton(i, v))}
              </ListItem>
            ))}
            <Divider variant="fullWidth" component="li" />
          </div>
        );
      })}
      {getFormForEmpty()}
    </List>
  );
}
