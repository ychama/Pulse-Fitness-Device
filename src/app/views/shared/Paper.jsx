import { withStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';

const Paper = withStyles({
  root: {
    boxShadow: '1px 5px 10px #E1E1E1',
    borderRadius: '8px',
    border: '1px solid #C3D4E1',
    padding: '10px',
  },
})(Box);

export default Paper;
