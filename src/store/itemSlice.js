import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    items: [],
    status: false,
    item: null
}
const itemSlice = createSlice({
    name: "item",
    initialState,
    reducers: {
        items: (state, action) => {
            state.status = true,
                state.items = action.payload
        },
        item: (state, action) => {
            state.status = true,
                state.item = action.payload
        }
    }
})
export const { items, item } = itemSlice.actions;
export default itemSlice.reducer