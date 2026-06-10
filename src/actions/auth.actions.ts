import { createAsyncThunk } from '@reduxjs/toolkit';

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../@types/api/auth.api';
import type { KnownError } from '../@types/api/errors.api';
import type { IUser } from '../@types/data';
import api from '../api/axiosInstance';
import { AUTH, USER } from '../constants/endpoints';
import { handleAxiosError } from '../utils/handleAxiosError';

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: KnownError }
>('auth/register', async (registerData, { rejectWithValue }) => {
  try {
    const { data } = await api.post(AUTH.REGISTER, registerData);

    return data;
  } catch (error) {
    return handleAxiosError(error, rejectWithValue);
  }
});

export const login = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: KnownError }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post(AUTH.LOGIN, credentials);

      return data;
    } catch (error) {
      return handleAxiosError(error, rejectWithValue);
    }
  },
);

export const initialize = createAsyncThunk<IUser, void, { rejectValue: KnownError }>(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue({
        status: 401,
        data: { message: 'No token found' },
      });
    }

    try {
      const { data } = await api.get(USER.ME);

      return data;
    } catch (error) {
      localStorage.removeItem('token');
      return handleAxiosError(error, rejectWithValue);
    }
  },
);
