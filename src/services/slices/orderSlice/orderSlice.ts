import { getOrderByNumber, getOrders, orderBurger } from '@thunks';
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrdersData } from '@utils-types';

const initialState: TOrdersData & { orderStatus: RequestStatus } = {
  orders: [],
  orderStatus: RequestStatus.Idle,
  total: 0,
  totalToday: 0
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.orderStatus = RequestStatus.Loading;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orderStatus = RequestStatus.Succeeded;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrders.rejected, (state) => {
        state.orderStatus = RequestStatus.Failed;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.orderStatus = RequestStatus.Loading;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderStatus = RequestStatus.Succeeded;
        state.orders = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.orderStatus = RequestStatus.Failed;
      })

      .addCase(orderBurger.pending, (state) => {
        state.orderStatus = RequestStatus.Loading;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderStatus = RequestStatus.Succeeded;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderStatus = RequestStatus.Failed;
      });
  }
});

export const ordersSelectors = orderSlice.selectors;
export const ordersActions = {
  ...orderSlice.actions,
  getOrders,
  getOrderByNumber,
  orderBurger
};

export default orderSlice;
