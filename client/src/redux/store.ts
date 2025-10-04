import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import signupReducer from './slices/signupSlice.ts';
import userReducer from './slices/userSlice.ts';
import purchaseReducer, { setTestData } from './slices/purchaseSlice.ts';

const rootReducer = combineReducers({
  signup: signupReducer,
  user: userReducer,
  purchase: purchaseReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

if (process.env.NODE_ENV === 'development') {
  store.dispatch(setTestData(1000));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;