import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CheckBoxTwoToneIcon from '@material-ui/icons/CheckBoxTwoTone';
import CheckBoxOutlineBlankTwoToneIcon from '@material-ui/icons/CheckBoxOutlineBlankTwoTone';
import {
  VISIT_1_COLOR, VISIT_2_COLOR, VISIT_3_COLOR, VISIT_4_COLOR,
} from '../../../constants';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function VisitNavigation(props) {
  const classes = useStyles();
  const { visitType } = props;

  const getIcon = function (visit) {
    if (visit === visitType) {
      return <CheckBoxTwoToneIcon />;
    }
    return <CheckBoxOutlineBlankTwoToneIcon />;
  };

  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction
        label="First visit"
        style={{ color: '#4d8af0' }}
        icon={getIcon('VISIT_1')}
      />
      <BottomNavigationAction
        label="Second visit"
        style={{ color: '#3ad29f' }}
        icon={getIcon('VISIT_2')}
      />
      <BottomNavigationAction
        label="Third visit"
        style={{ color: '#f19696' }}
        icon={getIcon('VISIT_3')}
      />
      <BottomNavigationAction
        label="Fourth visit"
        style={{ color: '#b685aa' }}
        icon={getIcon('VISIT_4')}
      />
    </BottomNavigation>
  );
}
