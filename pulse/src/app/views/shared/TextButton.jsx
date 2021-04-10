import { withStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

const TextButton = withStyles({
  root: {
    boxShadow: 'none',
    color: '#2C9FFA',
    fontWeight: '2em',
    fontStyle: 'Italic',
    '&:hover': {
      backgroundColor: '#EAF2F8',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#EAF2F8',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
})(Button);

export default TextButton;
