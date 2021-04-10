import React, { useState, useEffect } from "react";
import SimpleFormButton from "../../views/material-kit/forms/SimpleFormButton";
import ActualNotePanel from "./NotesTabs/ActualNotePanel";
import InterventionForm from "../../views/material-kit/forms/InterventionForm";
import ControlForm from "../../views/material-kit/forms/ControlForm";
import NotesTabTable from "./NotesTabs/NotesTabTable";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@material-ui/core";

export const chartNoteSelectionsControl = (disabledDropDown) => [
  {
    title: <em>Add new note</em>,
    id: 0,
  },
  {
    title: "Contact Log",
    id: 10,
  },
  {
    title: "Home integrity tool",
    id: 100,
    enabled: disabledDropDown
  },
  {
    title: "Note",
    id: 40,
  },
];

export const chartNoteSelectionsIntervention = (disabledDropDown) => [
  {
    title: <em>Add new note</em>,
    id: 0,
  },
  {
    title: "Contact Log",
    id: 10,
  },
  {
    title: "Home integrity tool",
    id: 100,
    enabled: disabledDropDown
  },
  {
    title: "Note",
    id: 40,
  },
];

const TabSelection = (props) => {
  const {
    user,
    studyCaseId,
    studyCaseType,
    id,
    visitType,
    parentHid,
    meetingId,
    setSelectedDropdownSelectorItem,
    selectedDropdownSelectorItem,
    setEditForm,
    parentName
  } = props;
  const [showNoteConfirmationModal, setShowNoteConfirmationModal] = useState(
      false
  );
  const [prevNote, setPrevNote] = useState(null);

  useEffect(() => {
    if (selectedDropdownSelectorItem === 0) {
      setPrevNote(null);
    }else if(selectedDropdownSelectorItem === 100){
      setShowNoteConfirmationModal(true)
    }
  }, [selectedDropdownSelectorItem]);

  const findSelectionComp = () => {
    switch (id) {
      case 0:
        return (
          <NotesTabTable
            studyCaseId={studyCaseId}
            staffType={user.staffType}
            studyCaseType={studyCaseType}
            setSelectedDropdownSelectorItem={setSelectedDropdownSelectorItem}
            setEditForm={setEditForm}
            setPrevNote={setPrevNote}
            meetingId={meetingId}
            visitType={visitType}
          />
        );
      case 10:
        return (
          <SimpleFormButton
            meetingId={meetingId}
            userId={user.id}
            parentHid={parentHid}
            studyCaseId={studyCaseId}
            editForm={prevNote}
            user={user}
            parentName={parentName}
            close={() => props?.close()}
          />
        );
      case 20:
        return (
          <InterventionForm
            parentHid={parentHid}
            visitType={visitType}
            studyCaseId={studyCaseId}
            editForm={prevNote}
            user={user}
            close={() => props?.close()}
            meetingId={meetingId}
          />
        );
      case 30:
        return (
          <ControlForm
            parentHid={parentHid}
            visitType={visitType}
            close={() => props?.close()}
            studyCaseId={studyCaseId}
            editForm={prevNote}
            user={user}
            meetingId={meetingId}
          />
        );
      case 40:
        return (
          <ActualNotePanel
            studyCaseId={studyCaseId}
            meetingId={meetingId}
            close={() => props?.close()}
            note={prevNote}
          />
        );
      default:
        return <div></div>;
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowNoteConfirmationModal(false);
  };

  return <>
    {findSelectionComp()}

    <Dialog
        open={showNoteConfirmationModal}
        onClose={handleCloseConfirmationModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Select
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => {
          handleCloseConfirmationModal();
          setSelectedDropdownSelectorItem(20)
        }} color="primary">
          Intervention Form
        </Button>
        <Button
            onClick={() => {
              handleCloseConfirmationModal();
              setSelectedDropdownSelectorItem(30)
            }}
            color="primary"
            autoFocus
        >
          Control Form
        </Button>
      </DialogActions>
    </Dialog>

    </>;
};

export default TabSelection;
