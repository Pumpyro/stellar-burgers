import { configureStore } from '@reduxjs/toolkit';
import orderSlice from './orderSlice';
import { getOrders, getOrderByNumber, orderBurger } from '@thunks';
import { RequestStatus } from '@utils-types';

describe('orderSlice test', () => {
  const initialState = {
    orders: [],
    orderByNumber: [],
    getOrderStatus: RequestStatus.Idle,
    getOrderByNumberStatus: RequestStatus.Idle,
    orderStatus: false,
    total: 0,
    totalToday: 0,
    userOrder: null
  };

  describe('Заказ бургера', () => {
    const mockNewOrderResponse = {
      success: true,
      name: 'Флюоресцентный люминесцентный метеоритный бургер',
      order: {
        _id: '6821fd60c2f30c001cb232c8',
        ingredients: ['643d69a5c3f7b9001cfa093d'],
        status: 'done',
        name: 'Флюоресцентный люминесцентный метеоритный бургер',
        createdAt: '2025-05-12T13:53:36.343Z',
        updatedAt: '2025-05-12T13:53:37.151Z',
        number: 76895,
        price: 5964,
        owner: {
          name: 'pumpyrotest',
          email: 'malashonok.nikitka@gmail.com',
          createdAt: '2025-05-08T14:34:51.134Z',
          updatedAt: '2025-05-11T11:48:17.868Z'
        }
      }
    };

    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNewOrderResponse)
        })
      ) as jest.Mock;
    });

    it('Сохранение заказа', async () => {
      const mockStore = configureStore({
        reducer: { order: orderSlice.reducer }
      });
      await mockStore.dispatch(orderBurger([]));

      const newState = mockStore.getState().order;

      expect(newState.orderStatus).toBe(false);
      expect(newState.userOrder).toEqual(mockNewOrderResponse.order);
    });

    it('orderStatus = false (orderBurger.rejected)', () => {
      const action = { type: orderBurger.rejected.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderStatus).toBe(false);
    });

    it('orderStatus = true (orderBurger.pending)', () => {
      const action = { type: orderBurger.pending.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderStatus).toBe(true);
    });

    it('orderStatus = false и сохранение userOrder (orderBurger.fulfilled)', () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: mockNewOrderResponse
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderStatus).toBe(false);
      expect(newState.userOrder).toEqual(mockNewOrderResponse.order);
    });
  });

  describe('Подтягивание заказов с api', () => {
    const mockGetOrdersResponse = {
      success: true,
      orders: [
        {
          _id: '1',
          ingredients: ['bun'],
          status: 'done',
          name: 'Бутербродик',
          createdAt: '',
          updatedAt: '',
          number: 123
        }
      ],
      total: 123,
      totalToday: 5
    };

    it('getOrderStatus = Failed (getOrders.rejected)', () => {
      const action = { type: getOrders.rejected.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.getOrderStatus).toBe(RequestStatus.Failed);
    });

    it('getOrderStatus = loading (getOrders.pending)', () => {
      const action = { type: getOrders.pending.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.getOrderStatus).toBe(RequestStatus.Loading);
    });

    it('getOrderStatus = succeeded, сохранение заказов, total и totalToday (getOrders.fulfilled)', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGetOrdersResponse)
        })
      ) as jest.Mock;

      const action = {
        type: getOrders.fulfilled.type,
        payload: mockGetOrdersResponse
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.getOrderStatus).toBe(RequestStatus.Succeeded);
      expect(newState.orders).toEqual(mockGetOrdersResponse.orders);
      expect(newState.total).toBe(123);
      expect(newState.totalToday).toBe(5);
    });
  });

  describe('Подтягивание заказа по номеру с api', () => {
    const mockGetOrderByNumberResponse = {
      success: true,
      orders: [
        {
          _id: '1',
          ingredients: ['bun'],
          status: 'done',
          name: 'Бутербродик',
          createdAt: '',
          updatedAt: '',
          number: 123
        }
      ]
    };

    it('getOrderByNumberStatus = failed (getOrderByNumber.rejected)', () => {
      const action = { type: getOrderByNumber.rejected.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.getOrderByNumberStatus).toBe(RequestStatus.Failed);
    });

    it('getOrderByNumberStatus = loading (getOrderByNumber.pending)', () => {
      const action = { type: getOrderByNumber.pending.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.getOrderByNumberStatus).toBe(RequestStatus.Loading);
    });

    it('getOrderByNumberStatus = succeeded, сохранение orderByNumber (getOrderByNumber.fulfilled)', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGetOrderByNumberResponse)
        })
      ) as jest.Mock;

      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockGetOrderByNumberResponse
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.getOrderByNumberStatus).toBe(RequestStatus.Succeeded);
      expect(newState.orderByNumber).toEqual(
        mockGetOrderByNumberResponse.orders
      );
    });
  });
});
