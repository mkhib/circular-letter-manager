import React from 'react';
import gql from 'graphql-tag';
import {
  Redirect,
  Link,
} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import usersBack from '../assets/images/usersBack.png';


const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtons: {
    fontFamily: 'FontNormalFD',
    marginLeft: 10,
    marginRight: 10,
  },
  modalTitle: {
    fontFamily: 'FontBold',
    fontSize: 18,
  },
  modalDescription: {
    fontFamily: 'FontNormal',
    fontSize: 15,
  },
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
  table: {
    minWidth: 650,
    fontFamily: 'FontNormalFD',
  },
  tableHeader: {
    fontFamily: 'FontNormal'
  },
  tableCells: {
    fontFamily: 'FontNormalFD',
  },
}));


const GET_APP_DETAILS = gql`
query GetAppDetails{
  appDetails{
    versionToShow
    version
    link
  }
}
`;


const DownloadApp: React.FC<ManageUsersProps> = (props) => {
  const { loading, error, data } = useQuery(GET_APP_DETAILS);


  const classes = useStyles();
  if (error) {
    if (error.message === 'GraphQL error: Authentication required') {
      return (<Redirect to={{
        pathname: '/login',
      }} />)
    }
  }
  if (loading) {
    return (<Box style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }}>
      <Backdrop className={classes.backdrop} open>
        <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
      </Backdrop>
    </Box>)
  }
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 40,
        backgroundAttachment: 'fixed',
        backgroundImage: `url(${usersBack})`,
        backgroundSize: '100% 100%',
        direction: 'rtl',
      }}
    >
      <img
        src={require('../assets/images/android.png')}
        style={{
          height: 100,
          width: 90,
        }}
        alt="android-alt"
      />
      <Box
        style={{
          fontFamily: 'FontNormal',
        }}
      >
        دانلود نسخه اندروید برنامه جست و جو در بخشنامه‌ها
      </Box>
      <Box
        style={{
          marginTop: 20,
        }}>
        <Button
          href={data.appDetails.link}
          variant="outlined"
        >
          <Box
            style={{
              fontFamily: 'FontNormalFD',
              fontSize: 20,
            }}>
            دانلود نسخه {data.appDetails.versionToShow}
          </Box>
        </Button>
      </Box>
      <Box style={{
        fontFamily: 'FontNormal',
        fontSize: 18,
        marginTop: 20,
      }}>
        <Link
          to="login"
        >
          ورود به حساب کاربری
        </Link>
      </Box>
    </Box>
  );
}


export default DownloadApp;

interface ManageUsersProps {
  history: any;
}
