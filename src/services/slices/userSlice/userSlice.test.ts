import { configureStore } from '@reduxjs/toolkit';
import { RequestStatus } from '@utils-types';
import * as api from '@api';
import userSlice, { initialState as mockState } from './userSlice';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '@thunks';
import { setCookie, deleteCookie } from '../../../utils/cookie';

jest.mock('../../../utils/cookie');

const mockUser = { email: 'test@gmail.com', name: 'pumpyro' };
const mockAuthResponse = {
  success: true,
  user: mockUser,
  accessToken: 'Bearer qwerty',
  refreshToken: 'fresh'
};

describe('userSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks;
  });

  describe('Регистрация пользователя', () => {
    it('Статус failed (registerUser.rejected)', () => {
      const action = { type: registerUser.rejected.type };
      const newState = userSlice.reducer(mockState, action);

      expect(newState.userStatus).toBe(RequestStatus.Failed);
    });

    it('Статус loading (registerUser.pending)', () => {
      const action = { type: registerUser.pending.type };
      const newState = userSlice.reducer(mockState, action);

      expect(newState.userStatus).toBe(RequestStatus.Loading);
    });

    it('Успешная регистрация', async () => {
      jest.spyOn(api, 'registerUserApi').mockResolvedValue(mockAuthResponse);
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      await mockStore.dispatch(
        registerUser({
          email: 'test@gmail.com',
          name: 'pumpyro',
          password: '123'
        })
      );
      const newState = mockStore.getState().user;

      expect(newState.user).toEqual(mockUser);
      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'Bearer qwerty');
      expect(localStorage.getItem('refreshToken')).toBe('fresh');
    });
  });

  describe('Авторизация пользователя', () => {
    it('Статус failed (loginUser.rejected)', () => {
      const action = { type: loginUser.rejected.type };
      const newState = userSlice.reducer(mockState, action);

      expect(newState.userStatus).toBe(RequestStatus.Failed);
    });

    it('Статус loading (loginUser.pending)', () => {
      const action = { type: loginUser.pending.type };
      const newState = userSlice.reducer(mockState, action);

      expect(newState.userStatus).toBe(RequestStatus.Loading);
    });

    it('Успешная авторизация', async () => {
      jest.spyOn(api, 'loginUserApi').mockResolvedValue(mockAuthResponse);
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      await mockStore.dispatch(
        loginUser({ email: 'test@gmail.com', password: '123' })
      );
      const newState = mockStore.getState().user;

      expect(newState.user).toEqual(mockUser);
      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('Выход из аккаунта', () => {
    it('Статус failed (logoutUser.rejected)', () => {
      const action = { type: logoutUser.rejected.type };
      const newState = userSlice.reducer(mockState, action);

      expect(newState.userStatus).toBe(RequestStatus.Failed);
    });

    it('Статус loading (logoutUser.pending)', () => {
      const action = { type: logoutUser.pending.type };
      const newState = userSlice.reducer(mockState, action);

      expect(newState.userStatus).toBe(RequestStatus.Loading);
    });

    it('Успешный выход', async () => {
      jest.spyOn(api, 'logoutApi').mockResolvedValue({ success: true });
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      mockStore.dispatch({
        type: loginUser.fulfilled.type,
        payload: mockAuthResponse
      });
      await mockStore.dispatch(logoutUser());
      const newState = mockStore.getState().user;

      expect(newState.user).toBeNull();
      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('Подтягивание пользователя из api', () => {
    it('Инициализация пользователя', async () => {
      jest
        .spyOn(api, 'getUserApi')
        .mockResolvedValue({ success: true, user: mockUser });
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      await mockStore.dispatch(getUser());
      const newState = mockStore.getState().user;

      expect(newState.user).toEqual(mockUser);
      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('Обновление данных пользователя', () => {
    it('Успешное обновление', async () => {
      jest
        .spyOn(api, 'updateUserApi')
        .mockResolvedValue({ success: true, user: mockUser });
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      await mockStore.dispatch(updateUser({ name: 'pumpyro' }));

      const newState = mockStore.getState().user;
      expect(newState.user).toEqual(mockUser);
      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('Пользователь забыл пароль', () => {
    it('Успешное выполнение запроса', async () => {
      jest.spyOn(api, 'forgotPasswordApi').mockResolvedValue({ success: true });
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      await mockStore.dispatch(forgotPassword({ email: 'test@gmail.com' }));
      const newState = mockStore.getState().user;

      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('Сброс пароля', () => {
    it('Успешный сброс', async () => {
      jest.spyOn(api, 'resetPasswordApi').mockResolvedValue({ success: true });
      const mockStore = configureStore({
        reducer: { user: userSlice.reducer }
      });
      await mockStore.dispatch(
        resetPassword({ password: '123456', token: 'reset-token' })
      );
      const newState = mockStore.getState().user;

      expect(newState.userStatus).toBe(RequestStatus.Succeeded);
    });
  });
});
