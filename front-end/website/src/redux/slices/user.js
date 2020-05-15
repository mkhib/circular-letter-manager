import { createSlice } from '@reduxjs/toolkit';
import { sessionService } from 'redux-react-session';
import * as sessionApi from '../../api/sessionApi';

// interface InitialStateProps {
//   personelNumber: number;
//   password: string;
//   redirectToReferrer: boolean;
//   user: string;
// }

let initialState = {
  personelNumber: '4444',
  password: 'Page7515',
  errors: [],
  graphqlError: '',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setAnything(state, action) {
      state[action.payload.theThing] = action.payload.data;
    },
    clearAnyThing(state, action) {
      state[action.payload.theThing] = '';
    },
    clearPersonelNumber(state, action) {
      state[action.payload.theThing] = 0;
    },
    loginAction(_state, action) {
      console.log('sisi', action.payload.user.data);
      sessionService.saveSession('true').then(() => {
        sessionService.saveUser(action.payload.user)
          .then(() => {
            action.payload.history.push('/search-letter');
          }).catch(err => console.error(err));
      })
    },
    logoutAction(_state, action) {
      sessionApi.logout().then(() => {
        sessionService.deleteSession();
        sessionService.deleteUser();
        action.payload.push('/login');
      }).catch(err => {
        throw (err);
      });
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setPersonelNumber(state, action) {
      state.personelNumber = action.payload;
    },
    setErrors(state, action) {
      state.errors = [];
      action.payload.forEach((error) => {
        state.errors.push(error.path);
      })
    },
  }
});

export const login = (user, history) => async (dispatch) => {
  if (user.id) {
    dispatch(loginAction({
      user,
      history,
    }));
  }
};

export const handleLogout = (history) => async (dispatch) => {
  dispatch(logoutAction(history));
};

const { reducer, actions } = userSlice;

export const {
  setAnything,
  setErrors,
  logoutAction,
  setPersonelNumber,
  setPassword,
  clearPersonelNumber,
  loginAction,
  clearAnyThing,
} = actions;

export default reducer;