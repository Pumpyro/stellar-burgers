import { TOrdersData, RequestStatus } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import { getFeed } from '@thunks';

const initialState: TOrdersData & {
  feedStatus: RequestStatus;
} = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedStatus: RequestStatus.Idle
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectStatus: (state) => state.feedStatus
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.feedStatus = RequestStatus.Loading;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.feedStatus = RequestStatus.Succeeded;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeed.rejected, (state) => {
        state.feedStatus = RequestStatus.Failed;
      });
  }
});

export const feedSelectors = feedSlice.selectors;
export const feedActions = {
  ...feedSlice.actions,
  getFeed
};

export default feedSlice;
