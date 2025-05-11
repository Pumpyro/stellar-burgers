import constructorSlice, { constructorActions } from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import mockData from '../mockData';

const bun = mockData.find((ing) => ing.type === 'bun')!;
const sauce = mockData.find((ing) => ing.name.includes('Space Sauce'))!;
const main1 = mockData.find((ing) => ing.name.includes('Магнолии'))!;
const main2 = mockData.find((ing) => ing.name.includes('метеорит'))!;

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

  // todo: удаление, смена порядка
});
