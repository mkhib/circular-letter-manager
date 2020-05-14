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

const PrivateRoute = ({ component, exact = false, path, authenticated }: any) => (
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
);

const AuthRouter = ({ authenticated, checked, requestedLetter }: any) => {
  return (
    <Router>
      {checked && (
        <Box style={{
          display: 'flex',
          width: '100%',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={UploadCircularLetter} authenticated={authenticated} />
            <PrivateRoute exact path="/uploadNewCircularLetter" component={UploadCircularLetter} authenticated={authenticated} />
            <PrivateRoute path={`/search-letter`} component={SearchLetters} authenticated={authenticated} />
            <PrivateRoute path={`/letter/`} component={Letter} authenticated={authenticated} />
            <PrivateRoute path={`/editDropDowns/`} component={EditSubjectsAndCategories} authenticated={authenticated} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Box>
      )}
    </Router>
  )
};

const mapState = ({ session, mainData }: any, ) => {
  const { requestedLetter } = mainData;
  return ({
    checked: session.checked,
    authenticated: session.authenticated,
    requestedLetter,
  });
}

export default connect(mapState)(AuthRouter);

