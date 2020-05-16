import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useApolloClient } from '@apollo/react-hooks';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { handleLogout } from '../redux/slices/user';
import { withRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import "../assets/animationStyle.scss"

const useStyles = makeStyles(theme => ({
  containerView: {
    backgroundColor: '#3f51b5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 20,
    flexDirection: 'row-reverse',
    width: '100%',
    height: 80,
  },
  link: {
    fontFamily: 'FontNormal',
    color: 'white',
    backgroundColor: '#2196f3',
    marginLeft: 10,
    '&:hover': {
      backgroundColor: '#0d47a1',
    }
  },
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  menuItem: {
    fontFamily: 'FontNormal',
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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen(true);
  };

  const handleClose = (event) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  const classes = useStyles();
  const {
    user,
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
  const client = useApolloClient();
  return (
    <Mutation mutation={LOGOUT} onCompleted={(data) => {
      if (data.logout) {
        client.resetStore();
        handleLogout(props.history);
      }
    }}>
      {(logout, { data, loading, error }) => {
        return (
          <Box className={classes.containerView}>
            {/* {renderLogin()} */}
            <Box style={{
              marginRight: 20,
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
            }}>
              <Button variant="contained" className={classes.link} href="/search-letter" color="primary">
                <div className="page-example">
                  جست و جو در بخشنامه‌ها
                </div>
              </Button>
              {user.isAdmin && (
                <React.Fragment>
                  <Button className={classes.link} href="/uploadNewCircularLetter" color="primary">
                    بارگذاری یک بخشنامه جدید
                  </Button>
                  <Button className={classes.link} href="/authorise-users" color="primary">
                    بررسی کاربران جدید
                  </Button>
                </React.Fragment>
              )}
            </Box>
            {authenticated && <Box>
              <Button
                ref={anchorRef}
                disableRipple
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onMouseOver={() => {
                  handleToggle();
                }}
                onMouseLeave={() => {
                  handleClose();
                }}
                style={{
                  marginLeft: 20,
                  borderRadius: 180,
                  paddingTop: 14,
                  paddingBottom: 14,
                  zIndex: 4000,
                  backgroundColor: '#2196f3',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <PersonOutlinedIcon style={{
                  height: 35,
                  width: 35,
                  color: 'white',
                }} />
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                      <Paper>
                        <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <MenuItem className={classes.menuItem} onClick={(event) => {
                            handleClose(event);
                            props.history.push({
                              pathname: `/profile`
                            });
                          }}>
                            <ListItemIcon>
                              <AccountCircleOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText style={{ fontFamily: 'FontNormal' }} disableTypography primary="حساب کاربری" />
                          </MenuItem>
                          <MenuItem className={classes.menuItem} onClick={(event) => {
                            handleClose(event);
                            logout();
                          }}>
                            <ListItemIcon>
                              <ExitToAppOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText style={{ fontFamily: 'FontNormal' }} disableTypography primary="خروج از حساب کاربری" />
                          </MenuItem>
                        </MenuList>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Button>
            </Box>}
          </Box>
        );
      }}
    </Mutation>
  );
}

const mapState = ({ session }) => ({
  checked: session.checked,
  user: session.user,
  authenticated: session.authenticated
});

export default connect(mapState, {
  handleLogout
})(withRouter(Header));
