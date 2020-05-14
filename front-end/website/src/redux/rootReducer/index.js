import { combineReducers } from '@reduxjs/toolkit';
import dataSlice from '../slices/data';
import userSlice from '../slices/user';
import { sessionReducer } from 'redux-react-session';

const reducers = {
  mainData: dataSlice,
  userData: userSlice,
  session: sessionReducer
};

export default combineReducers(reducers);