import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"
import restSlice from "./restSlice"
import itemSlice from './itemSlice'
import orderSlice from './orderSlice'
const store = configureStore({
    reducer: {
        auth: authSlice,
        restaurant: restSlice,
        item: itemSlice,
        order: orderSlice
    }
})
export default store;
