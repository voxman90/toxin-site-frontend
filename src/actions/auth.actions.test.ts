// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { LoginResponse, RegisterRequest, RegisterResponse } from '../@types/api/auth.api';
import type { BaseError } from '../@types/api/errors.api';
import type { IUser } from '../@types/data';
import { createAxiosErrorMock, createUserMock } from '../__tests__/fixtures/fixtures';
import api from '../api/axiosInstance';
import { AUTH, USER } from '../constants/endpoints';

import { initialize, login, register } from './auth.actions';

vi.mock('../api/axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authActions', () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should dispatch fulfilled when login is successful', async () => {
      const payload: LoginResponse = {
        user: createUserMock(),
        token: 'fake-token',
        message: 'success',
      };
      const credentials = { email: 'test@test.com', password: 'qwerty' };

      vi.mocked(api.post).mockResolvedValueOnce({ data: payload });

      const dispatch = vi.fn();
      const thunk = login(credentials);

      const result = await thunk(dispatch, () => ({}), {});

      expect(api.post).toHaveBeenCalledWith(AUTH.LOGIN, credentials);
      expect(result.type).toBe(login.fulfilled.type);
      expect(result.payload).toEqual(payload);
    });

    it('should dispatch rejected when API returns an error', async () => {
      const errorData: BaseError = { message: 'Invalid credentials' };
      const error = createAxiosErrorMock(errorData, 401);

      vi.mocked(api.post).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = login({ email: 'wrong@test.com', password: 'qwerty' });

      const result = await thunk(dispatch, () => ({}), {});

      expect(result.type).toBe(login.rejected.type);
      expect(result.payload).toEqual({ status: 401, data: errorData });
    });
  });

  describe('register', () => {
    const registerRequest: RegisterRequest = {
      firstName: 'Max',
      lastName: 'Y',
      birthdate: '11.05.1990',
      gender: 'Male',
      specialOffer: false,
      email: 'test@test.com',
      password: 'qwerty',
    };

    it('should dispatch fulfilled when register is successful', async () => {
      const payload: RegisterResponse = { message: 'Success' };

      vi.mocked(api.post).mockResolvedValueOnce({ data: payload });
      const dispatch = vi.fn();

      const thunk = register(registerRequest);

      const result = await thunk(dispatch, () => ({}), {});

      expect(api.post).toHaveBeenCalledWith(AUTH.REGISTER, registerRequest);
      expect(result.type).toBe(register.fulfilled.type);
      expect(result.payload).toEqual(payload);
    });

    it('should dispatch rejected when API return an error', async () => {
      const errorData: BaseError = { message: 'Email is already taken' };
      const error = createAxiosErrorMock(errorData, 400);
      vi.mocked(api.post).mockRejectedValueOnce(error);

      const dispatch = vi.fn();

      const thunk = register(registerRequest);

      const result = await thunk(dispatch, () => ({}), {});

      expect(result.type).toBe(register.rejected.type);
      expect(result.payload).toEqual({ status: 400, data: errorData });
    });
  });

  describe('initialize', () => {
    it('should dispatch rejected when there is no token in localStorage', async () => {
      const dispatch = vi.fn();
      const thunk = initialize();

      const result = await thunk(dispatch, () => ({}), {});

      expect(getItemSpy).toHaveBeenCalledWith('token');
      expect(result.type).toBe(initialize.rejected.type);
      expect(result.payload).toEqual({ status: 401, data: { message: 'No token found' } });
    });

    it('should dispatch rejected and remove token from localStorrage when API return an error', async () => {
      localStorage.setItem('token', 'fake-token');

      const errorData: BaseError = { message: 'Session expired' };
      const error = createAxiosErrorMock(errorData, 401);
      vi.mocked(api.get).mockRejectedValueOnce(error);

      const dispatch = vi.fn();
      const thunk = initialize();

      const result = await thunk(dispatch, () => ({}), {});

      expect(removeItemSpy).toHaveBeenCalledWith('token');
      expect(result.type).toBe(initialize.rejected.type);
      expect(result.payload).toEqual({ status: 401, data: errorData });
    });

    it('should dispatch fulfilled when there is initialize is successful', async () => {
      localStorage.setItem('token', 'fake-token');

      const user: IUser = createUserMock();
      vi.mocked(api.get).mockResolvedValueOnce({ data: user });

      const dispatch = vi.fn();
      const thunk = initialize();

      const result = await thunk(dispatch, () => ({}), {});

      expect(api.get).toHaveBeenCalledWith(USER.ME);
      expect(result.type).toBe(initialize.fulfilled.type);
      expect(result.payload).toEqual(user);
    });
  });
});
