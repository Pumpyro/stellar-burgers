import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getOrderByNumber = createAsyncThunk(
  `order/getOrderByNumber`,
  async (number: number) => await getOrderByNumberApi(number)
);

export const getOrders = createAsyncThunk(
  `order/getOrders`,
  async () => await getOrdersApi()
);

export const orderBurger = createAsyncThunk(
  `order/orderBurger`,
  async (data: string[]) => await orderBurgerApi(data)
);
