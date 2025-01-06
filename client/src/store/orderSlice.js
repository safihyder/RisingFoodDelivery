import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    userorder: []
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.userorder = action.payload;
        },
        removeOrder: (state, action) => {
            state.userorder.splice(action.payload.index, 1);
        },
        dropOrders: (state) => {
            state.userorder = [];
        },
        updateOrder: (state, action) => {
            const foodIndex = state.userorder.findIndex(food => food.id === action.payload.id);
            if (foodIndex !== -1) {
                state.userorder[foodIndex] = {
                    ...state.userorder[foodIndex],
                    qty: action.payload.qty,
                    price: action.payload.price + state.userorder[foodIndex].price
                };
            }
        }
    }
});
export const { addOrder, removeOrder, dropOrders, updateOrder } = orderSlice.actions;
export default orderSlice.reducer;