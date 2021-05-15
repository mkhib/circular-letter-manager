import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    fontFamily: 'FontNormalFD',
    flexDirection: 'column',
    alignItems: 'flex-end',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  snackStyle: {
    fontFamily: 'FontNormal',
  },
  snackBox: {
    marginLeft: 20,
    marginRight: 20,
  },
}));

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface SnackProps {
  open: boolean;
  autoHideDuration?: number;
  onClose: () => void;
  message: string;
  severity: 'success' | 'error';

}

const Snack: React.FC<SnackProps> = (props) => {
  const {
    open,
    autoHideDuration,
    onClose,
    severity,
    message,
  } = props;
  const classes = useStyles();
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration || 6000} onClose={onClose}>
      <Alert className={classes.snackStyle} onClose={onClose} severity={severity}>
        <Box className={classes.snackBox}>
          {message}
        </Box>
      </Alert>
    </Snackbar>
  );
}

export default Snack;