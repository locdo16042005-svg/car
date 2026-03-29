import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
};

const computeTotal = (items) =>
  items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
      state.totalPrice = computeTotal(action.payload);
    },
    addToCart(state, action) {
      const exists = state.items.some((i) => i.carId === action.payload.carId);
      if (!exists) {
        state.items.push(action.payload);
        state.totalPrice = computeTotal(state.items);
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.carId !== action.payload);
      state.totalPrice = computeTotal(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { setCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
