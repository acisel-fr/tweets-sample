import { configureStore } from '@reduxjs/toolkit';
import constantsReducer from './constants';

const store = configureStore({
  reducer: {
    constants: constantsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
