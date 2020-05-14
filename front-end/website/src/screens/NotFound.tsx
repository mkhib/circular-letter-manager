import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import notFound from '../assets/images/notFound.png';

const useStyles = makeStyles(() => ({
  wholePage: {
    fontFamily: 'FontNormal',
    color: 'rgb(138, 138, 138)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${notFound})`,
    backgroundSize: '80vw',
    backgroundRepeat: 'no-repeat',
    flex: 1,
  },
}));

const NotFound = () => {
  const classes = useStyles();
  return (
    <Box style={{
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
    }}>
      <Box className={classes.wholePage} />
    </Box>
  );
}

export default NotFound;