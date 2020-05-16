import React from 'react';
import gql from 'graphql-tag';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import profile from '../assets/images/profile.jpg';

const useStyles = makeStyles(theme => ({
  wholePage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  line: {
    display: 'flex',
    fontFamily: 'FontNormalFD',
    paddingLeft: 20,
    fontSize: 18,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
}));

interface EachLineProps {
  title: string;
  value: string
}

const Line: React.FC<EachLineProps> = (props) => {
  const classes = useStyles();
  const {
    title,
    value,
  } = props;
  return (
    <Box
      border={1}
      borderRadius={15}
      borderColor="#3f51b5"
      className={classes.line}>
      <Box>
        {title}
      </Box>
      <Box style={{ marginLeft: 5 }}>
        :
      </Box>
      <Box>
        {value}
      </Box>
    </Box>
  );
}

const GET_PROFILE = gql`
query user{
  user{
  firstName
  lastName
  personelNumber
  phoneNumber
  }
}
`;

const Profile = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_PROFILE);
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  });
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
      className={classes.wholePage}
      style={{
        // width: width,
        backgroundImage: `url(${profile})`,
        backgroundRepeat: 'no-repeat',
        flex: 1,
        // backgroundColor: 'red',
        backgroundSize: 'cover',
        // backgroundSize: height + 500,
      }}
    >
      <Box
        border={1}
        borderRadius={50}
        borderColor="#2196f3"
        style={{
          padding: 100,
        }}
      >
        <Line title="نام و  نام‌خانوادگی" value={`${data.user.firstName} ${data.user.lastName}`} />
        <Line title="شماره پرسنلی" value={data.user.personelNumber} />
        <Line title="شماره تلفن" value={data.user.phoneNumber} />
        <Button style={{
          fontFamily: 'FontNormal',
          marginTop: 10,
          paddingLeft: 50,
          backgroundColor: '#2196f3',
          color: 'white',
          paddingRight: 50,
        }}
          variant="contained"
          href="/change-password"
        >
          تغییر رمزعبور
        </Button>
      </Box>
    </Box>
  );
}

export default Profile;
