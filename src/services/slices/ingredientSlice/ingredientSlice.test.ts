import mockData from './mockData';
import { configureStore } from '@reduxjs/toolkit';
import ingredientSlice from './ingredientSlice';
import { getIngredients } from '@thunks';
import { RequestStatus } from '@utils-types';

describe('ingredientSlice', () => {
  const mockState = {
    ingredientStatus: RequestStatus.Idle,
    ingredients: []
  };
  it('Подтягивание всех ингредиентов с api', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockData
          })
      })
    ) as jest.Mock;

    const mockStore = configureStore({
      reducer: {
        ingredients: ingredientSlice.reducer
      }
    });

    await mockStore.dispatch(getIngredients());
    const newState = mockStore.getState().ingredients;

    expect(newState.ingredientStatus).toEqual(RequestStatus.Succeeded);
    expect(newState.ingredients).toEqual(mockData);
  });

  it('Статус failed (getIngredients.rejected)', () => {
    const action = { type: getIngredients.rejected.type };
    const newState = ingredientSlice.reducer(mockState, action);

    expect(newState.ingredientStatus).toBe(RequestStatus.Failed);
  });

  it('Статус loading (getIngredients.pending)', () => {
    const action = { type: getIngredients.pending.type };
    const newState = ingredientSlice.reducer(mockState, action);

    expect(newState.ingredientStatus).toBe(RequestStatus.Loading);
    expect(newState.ingredients).toEqual([]);
  });

  it('Статус succeeded и сохранение данных (getIngredients.fulfilled)', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockData
    };
    const newState = ingredientSlice.reducer(mockState, action);

    expect(newState.ingredientStatus).toBe(RequestStatus.Succeeded);
    expect(newState.ingredients).toEqual(mockData);
  });
});
