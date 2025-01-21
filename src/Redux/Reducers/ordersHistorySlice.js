import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const ordersHistory = createSlice({
  name: 'ordersHistory',
  initialState,
  reducers: {
    saveOrders(state, action) {
      state.value = action.payload;
    },
    clearOrders(state) {
      state.value = [];
    },
    updateOrderStatus(state, action) {
      const { orderId, status } = action.payload;
      const order = state.value.find(order => order.id === orderId);
      if (order) {
        order.status = status;
      }
    },
  },
});

export const { saveOrders, clearOrders, updateOrderStatus } = ordersHistory.actions;
export default ordersHistory.reducer;
