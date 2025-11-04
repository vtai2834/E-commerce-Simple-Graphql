import { configureStore } from '@reduxjs/toolkit';
import authenticatorSlice from './authenticator-slice';

import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    authenticator: authenticatorSlice,
  },
  middleware: (getDefaultMiddleware: (arg0: { serializableCheck: boolean; }) => any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();