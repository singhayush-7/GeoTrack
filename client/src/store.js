import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import locationReducer from './features/locationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    locations: locationReducer
  }
});
