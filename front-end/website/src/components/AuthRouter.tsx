import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../screens/Login';
import UploadCircularLetter from '../screens/UploadCircularLetter';
import SearchLetters from '../screens/SearchLetters';
import Letter from '../screens/Letter';
import Box from '@material-ui/core/Box'
import Header from './Header';
import NotFound from '../screens/NotFound';
import EditSubjectsAndCategories from '../screens/EditSubjectsAndCategories';
import EditCircularLetter from '../screens/EditCircularLetter';
import PendingUsers from '../screens/PendingUsers';
import Profile from '../screens/Profile';
import ChangePassword from '../screens/ChangePassword';
import AddNewUser from '../screens/AddNewUser';

const PrivateRoute = ({ component, exact = false, path, authenticated, isAdmin }: any) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={props => (
        authenticated ? (
          <React.Fragment>
            <Header />
            {React.createElement(component, props)}
          </React.Fragment>
        ) : (
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }} />
          )
      )}
    />
  )
};

const SuperPrivateRoute = ({ component, exact = false, path, authenticated, isAdmin }: any) => {
  return (<Route
    exact={exact}
    path={path}
    render={props => (
      (authenticated && isAdmin) ? (
        <React.Fragment>
          <Header />
          {React.createElement(component, props)}
        </React.Fragment>
      ) : (
          <Redirect to={{
            pathname: '/search-letter',
            state: { from: props.location }
          }} />
        )
    )}
  />)
};

const AuthRouter = ({ authenticated, checked, user }: any) => {
  return (
    <Router>
      {(checked && user) && (
        <Box style={{
          display: 'flex',
          width: '100%',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={SearchLetters} authenticated={authenticated} />
            <PrivateRoute path={`/letter/`} component={Letter} authenticated={authenticated} />
            <PrivateRoute path={`/search-letter`} component={SearchLetters} authenticated={authenticated} />
            <PrivateRoute path={`/profile`} component={Profile} authenticated={authenticated} />
            <PrivateRoute path={`/change-password`} component={ChangePassword} authenticated={authenticated} />
            {user.isAdmin && <React.Fragment><SuperPrivateRoute path="/uploadNewCircularLetter" component={UploadCircularLetter} isAdmin={user.isAdmin} authenticated={authenticated} />
              <SuperPrivateRoute path={`/editDropDowns/`}
                component={EditSubjectsAndCategories}
                isAdmin={user.isAdmin}
                authenticated={authenticated}
              />
              <SuperPrivateRoute path="/edit-circular-letter"
                component={EditCircularLetter}
                isAdmin={user.isAdmin}
                authenticated={authenticated}
              />
              <SuperPrivateRoute path="/authorise-users"
                component={PendingUsers}
                isAdmin={user.isAdmin}
                authenticated={authenticated}
              />
              <SuperPrivateRoute path="/add-new-user"
                component={AddNewUser}
                isAdmin={user.isAdmin}
                authenticated={authenticated}
              />
              {/* <Route path="*" component={NotFound} /> */}
            </React.Fragment>}
            <Route path="*" component={NotFound} />
          </Switch>
        </Box>
      )}
    </Router>
  )
};

const mapState = ({ session }: any, ) => {
  return ({
    user: session.user,
    checked: session.checked,
    authenticated: session.authenticated,
  });
}

export default connect(mapState)(AuthRouter);
