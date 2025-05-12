import constructorSlice, { constructorActions } from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import mockData from './mockData';

const bun = mockData.find((ing) => ing.type === 'bun')!;
const sauce = mockData.find((ing) => ing.name.includes('Space Sauce'))!;
const meat1 = mockData.find((ing) => ing.name.includes('Магнолии'))!;
const meat2 = mockData.find((ing) => ing.name.includes('метеорит'))!;

describe('constructorSlice test', () => {
  it('Инициализация состояния', () => {
    expect(constructorSlice.reducer(undefined, { type: '' })).toEqual({
      addedIngredients: [],
      bun: null
    });
  });

  it('Добавление булочки (bun)', () => {
    const action = constructorActions.addIngredient(bun);
    const newState = constructorSlice.reducer(undefined, action);

    expect(newState.bun?.name).toBe(bun.name);
    expect(newState.bun?.id).toBeDefined();
    expect(newState.addedIngredients).toHaveLength(0);
  });

  it('Добавление ингредиента (non bun)', () => {
    const action = constructorActions.addIngredient(sauce);
    const newState = constructorSlice.reducer(undefined, action);
    expect(newState.bun).toBeNull();
    expect(newState.addedIngredients.length).toBe(1);
    expect(newState.addedIngredients[0].name).toBe(sauce.name);
  });

  it('Удаление ингредиента', () => {
    const mockIngr = { ...meat1, id: 'testID' };
    const mockState = {
      addedIngredients: [mockIngr],
      bun: null
    };

    const action = constructorActions.deleteIngredient(mockIngr);
    const newState = constructorSlice.reducer(mockState, action);

    expect(newState.addedIngredients).toHaveLength(0);
  });

  it('Смена порядка ингредиентов', () => {
    const mockIngr1: TConstructorIngredient = { ...meat1, id: '1' };
    const mockIngr2: TConstructorIngredient = { ...meat2, id: '2' };

    const mockState = {
      addedIngredients: [mockIngr1, mockIngr2],
      bun: null
    };

    const action = constructorActions.moveIngredient({ from: 0, to: 1 });
    const newState = constructorSlice.reducer(mockState, action);
    expect(newState.addedIngredients[0].id).toBe('2');
    expect(newState.addedIngredients[1].id).toBe('1');
  });

  it('Смена порядка ингредиентов (индексы вне предела)', () => {
    const mockIngr1: TConstructorIngredient = { ...meat1, id: '1' };
    const mockIngr2: TConstructorIngredient = { ...meat2, id: '2' };

    const mockState = {
      addedIngredients: [mockIngr1, mockIngr2],
      bun: null
    };

    const action = constructorActions.moveIngredient({ from: 5, to: 6 });
    const newState = constructorSlice.reducer(mockState, action);
    expect(newState).toEqual(mockState);
  });
});
