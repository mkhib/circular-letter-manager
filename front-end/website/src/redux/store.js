import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { sessionService } from 'redux-react-session';
import rootReducer from './rootReducer';



const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

sessionService.initSessionService(store);

export default store;
