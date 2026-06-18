// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { LoginResponse, RegisterResponse } from '../@types/api/auth.api';
import { createUserMock, knownErrorMock } from '../__tests__/fixtures/fixtures';
import { initialize, login, register } from '../actions/auth.actions';

import type { AuthState } from './auth';
import authReducer, { clearError, logout } from './auth';

const createInitialState = (overrides: Partial<AuthState> = {}): AuthState => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,
  ...overrides,
});

const createDirtyState = (overrides: Partial<AuthState> = {}): AuthState => ({
  token: 'token',
  user: createUserMock(),
  isLoading: false,
  error: null,
  ...overrides,
});

describe('auth', () => {
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should return the initial state when passed an empty action', () => {
    const result = authReducer(undefined, { type: '' });

    expect(result).toEqual(createInitialState());
  });

  describe('reducers', () => {
    it('should handle clearError', () => {
      const stateWithError = createDirtyState({ error: knownErrorMock });
      const result = authReducer(stateWithError, clearError());

      expect(result.error).toBe(null);
    });

    it('should handle logout', () => {
      const result = authReducer(createDirtyState(), logout());

      expect(result.token).toBe(null);
      expect(result.user).toBe(null);
      expect(removeItemSpy).toHaveBeenCalledWith('token');
    });
  });

  describe('extraReducers (login)', () => {
    it('should set isLoading to true when login is pending', () => {
      const action = { type: login.pending.type };
      const state = authReducer(createInitialState(), action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set user and token when login is fulfilled', () => {
      const payload: LoginResponse = {
        message: 'Success',
        token: 'new-token',
        user: createUserMock(),
      };
      const action = { type: login.fulfilled.type, payload };
      const state = authReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.token).toBe(payload.token);
      expect(setItemSpy).toHaveBeenCalledWith('token', 'new-token');
    });

    it('should set error when login is rejected', () => {
      const action = { type: login.rejected.type, payload: knownErrorMock };
      const state = authReducer(createDirtyState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toEqual(knownErrorMock);
    });
  });

  describe('extraReducers (initialize)', () => {
    it('should set isLoading to true when initialize is pending', () => {
      const action = { type: initialize.pending.type };
      const state = authReducer(createInitialState(), action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set user when initialize is fullfiled', () => {
      const user = createUserMock();
      const action = { type: initialize.fulfilled.type, payload: user };
      const state = authReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(user);
    });

    it('should clear user and localStorage when initialize is rejected', () => {
      const action = { type: initialize.rejected.type };
      const state = authReducer(createDirtyState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
      expect(removeItemSpy).toHaveBeenCalledWith('token');
    });
  });

  describe('extraReducers (register)', () => {
    it('should set isLoading to true when register is pending', () => {
      const action = { type: register.pending.type };
      const state = authReducer(createInitialState(), action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set isLoading to false when register is fullfiled', () => {
      const payload: RegisterResponse = {
        message: 'Success',
        token: 'new-token',
        user: createUserMock(),
      };
      const action = { type: register.fulfilled.type, payload };
      const state = authReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
    });

    it('should set isLoading to false and set error when register is rejected', () => {
      const action = { type: register.rejected.type, payload: knownErrorMock };
      const state = authReducer(createInitialState({ isLoading: true }), action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toEqual(knownErrorMock);
    });
  });
});
