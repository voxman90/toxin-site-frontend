import { createSlice } from '@reduxjs/toolkit';

import type { KnownError } from '../@types/api/errors.api';
import type { IUser } from '../@types/data';
import { initialize, login, register } from '../actions/auth.actions';
import { UnknownError } from '../constants/constants';

export interface AuthState {
  token: string | null;
  user: IUser | null;
  isLoading: boolean;
  error: KnownError | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload ?? UnknownError;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        localStorage.setItem('token', payload.token);
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload ?? UnknownError;
      })

      .addCase(initialize.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initialize.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(initialize.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
