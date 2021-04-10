import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Divider from '@material-ui/core/Divider';
import NoteButton from '../button/NoteButton';
import FormButton from '../button/FormButton';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function VisitDividers2(props) {
  const { meetingId } = props;
  const classes = useStyles();
  const [question, setQuestion] = useState([
    {
      id: 'fdsd',
      caption: 'Why is the sky blue?',
      type: 1,
      content: '1111111111111111111111111',
    },
    {
      id: 'adsf',
      caption: 'Who invented pizza?',
      type: 2,
      content: '1111111111111111111111111',
    },
    {
      id: 'afdsf',
      caption: 'Is green tea overrated',
      type: 1,
      content: '1111111111111111111111111',
    },
  ]);
  const groupBy = (key) => (array) => array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
    }),
    {},
  );
  const createNoteButton = function (button) {
    return React.createElement(NoteButton, button.caption);
  };
  const groupByType = groupBy('type');

  const createListItemButtons = function (items) {
    console.log(items);
    return items.map((v, k) => {
      createNoteButton(v);
    });
  };

  return (
    <div />
    /* <List className={classes.root}>{ */

  /* createNoteButton(object:{caption:"sdfasd"}) */
  /* Object.entries(groupByType(question)).forEach(([key, value]) => {
                React.createElement(NoteButton,{color:"red"} )) */

  /* createListItemButtons(value) */
  /* <ListItem>
                   {
                       value.forEach(n => {
                           <NoteButton color="red" description=n.caption  />
                       })}
                   }
               </ListItem> */
  /* value.forEach(n => {
                    console.log(n, key)
                })} */

  /*  })}

        </List>
*/

  /*  <List className={classes.root}>
              <ListItem>
                  <NoteButton color="red" description="before"  />
                  <NoteButton color="red" add meetingId={meetingId} />
              </ListItem>
              <ListItem>
                  <FormButton color="red" title="Form-1"/>
              </ListItem>
              <Divider variant="fullWidth" component="li" />
              <ListItem >
                  <NoteButton color="blue"  description="morning" />
                  <NoteButton color="blue"  description="evening" />

              </ListItem>
              <Divider variant="fullWidth" component="li"  />
              <ListItem>
                  <NoteButton color="green"  />
                  <NoteButton color="green"  />
                  <NoteButton color="green"  />
              </ListItem>
          </List>*!/ */
  );
}
