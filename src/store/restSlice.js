import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    status: false,
    restaurants: [],
    restaurant: null
}
const restSlice = createSlice({
    name: "restaurant",
    initialState,
    reducers: {
        restaurants: (state, action) => {
            state.status = true,
                state.restaurants = action.payload.restaurant

        },
        restaurant: (state, action) => {
            state.status = true,
                state.restaurant = action.payload.restaurant

        }
    }
})
export const { restaurants } = restSlice.actions;
export default restSlice.reducer