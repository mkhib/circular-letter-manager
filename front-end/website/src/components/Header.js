import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from '@apollo/react-components';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
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
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import RecentActorsRoundedIcon from '@material-ui/icons/RecentActorsRounded';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
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
  list: {
    width: 270,
  },
  listItemText: {
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
  const [open, setOpen] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen(true);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState(open);
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
  const client = useApolloClient();
  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['جست و جو در بخشنامه‌ها', 'بارگذاری بخشنامه جدید'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 && <SearchRoundedIcon />}
              {index === 1 && <PublishRoundedIcon />}
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.listItemText
              }}
              primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['بررسی کاربران جدید', 'افزودن کاربر جدید', 'مدیریت همه کاربران'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.listItemText
              }}
              primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
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
            <Box style={{
              marginRight: 20,
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
            }}>
              <div>
                {['left'].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(true)}>
                      <MenuRoundedIcon style={{ color: 'white', fontSize: 30 }} />
                    </Button>
                    <Drawer anchor={anchor} open={drawerState} onClose={toggleDrawer(false)}>
                      {list()}
                    </Drawer>
                  </React.Fragment>
                ))}
              </div>
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
                  <Button className={classes.link} href="/add-new-user" color="primary">
                    افزودن کاربر جدید
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
