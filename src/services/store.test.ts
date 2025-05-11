import store from '@store';
import {
  userSlice,
  ingredientSlice,
  orderSlice,
  constructorSlice,
  feedSlice
} from '@slices';

describe('Test: инициализация rootReducer', () => {
  it('Должны быть инициализированы все срезы в store', () => {
    const state = store.getState();

    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(ingredientSlice.name);
    expect(state).toHaveProperty(orderSlice.name);
    expect(state).toHaveProperty(feedSlice.name);
    expect(state).toHaveProperty(constructorSlice.name);
  });
});
