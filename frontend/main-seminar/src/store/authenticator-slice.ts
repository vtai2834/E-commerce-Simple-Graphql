import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthenticatorState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "CUSTOMER" | "ADMIN"
  }
  authenticated: boolean;
}

const initialState : AuthenticatorState = {
  user: {
    id:'',
    email: '',
    firstName: '',
    lastName: '',
    role: "CUSTOMER",
  },
  authenticated: false,
};

const authenticatorSlice = createSlice({
  name: 'authenticator',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthenticatorState>) => {
      state.authenticated = action.payload.authenticated;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.user = {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        role: "CUSTOMER",
      };
      state.authenticated = false;
    },

    meInfo: (state, action: PayloadAction<AuthenticatorState>) => {
      state.authenticated = true;
      state.user = action.payload.user;
    }
  },
});

export const { login, logout , meInfo } = authenticatorSlice.actions;
export default authenticatorSlice.reducer;