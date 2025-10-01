import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import signupReducer from './slices/signupSlice.ts';
import userReducer from './slices/userSlice.ts';
import purchaseReducer, { setTestData } from './slices/purchaseSlice.ts';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['signup', 'user', 'purchase'],
};

const rootReducer = combineReducers({
  signup: signupReducer,
  user: userReducer,
  purchase: purchaseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

if (process.env.NODE_ENV === 'development') {
  store.dispatch(setTestData(1000));
}

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;