import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getIngredients = createAsyncThunk(
  `ingredient/getIngredients`,
  async () => await getIngredientsApi()
);
