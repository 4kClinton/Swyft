import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

const driverDetails = createSlice({
  name: 'driverDetails',
  initialState,
  reducers: {
    saveDriver(state, action) {
      state.value = action.payload;
    },
    removeDriver(state) {
      state.value = {};
    },
  },
});

export const { saveDriver, removeDriver } = driverDetails.actions;
export default driverDetails.reducer;
