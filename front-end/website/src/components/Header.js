import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { handleLogout } from '../redux/slices/user';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  containerView: {
    backgroundColor: '#3f51b5',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 20,
    flexDirection: 'row-reverse',
    width: '100%',
    height: 80,
  },
  link: {
    fontFamily: 'FontNormal',
    color: 'white',
  },
}));

// interface HeaderProps {
//   checked: any;
//   authenticated: any;
//   logout: any;
// }

const LOGOUT = gql`
mutation Logout{
  logout
}
`;

const Header = (props) => {
  const classes = useStyles();
  const {
    checked,
    authenticated,
    handleLogout,
  } = props;
  const renderLogin = () => {
    if (checked) {
      if (!authenticated) {
        return (
          <Button className={classes.link} href="/login" color="primary">
            ثبت‌نام
          </Button>
        );
      }
    }
  }
  const renderLogout = (onClickArg) => {
    if (checked) {
      if (authenticated) {
        return (
          <Button
            className={classes.link}
            onClick={() => {
              onClickArg();
            }}
            color="primary">
            خروج از حساب کاربری
          </Button>
        );
      }
    }
  }
  return (
    <Mutation mutation={LOGOUT} onCompleted={(data) => {
      if (data.logout) {
        handleLogout(props.history);
      }
    }}>
      {(logout, { data, loading, error }) => {
        return (
          <Box className={classes.containerView}>
            {/* {renderLogin()} */}
            <Button className={classes.link} href="/search-letter" color="primary">
              جست و جو در بخشنامه‌ها
            </Button>
            <Button className={classes.link} href="/uploadNewCircularLetter" color="primary">
              بارگذاری یک بخشنامه جدید
            </Button>
            {renderLogout(() => logout())}
          </Box>
        );
      }}
    </Mutation>
  );
}

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated
});

export default connect(mapState, {
  handleLogout
})(withRouter(Header));
