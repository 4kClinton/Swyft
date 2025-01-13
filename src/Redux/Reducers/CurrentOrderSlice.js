import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value:{}
}

const currentOrder = createSlice({
    name:"currentOrder",
    initialState,
    reducers:{
        saveOrder(state,action){
            state.value = action.payload
        },
        deleteOrder(state){
            state.value = {}
        }
       
    }
})

export const {saveOrder, deleteOrder} =currentOrder.actions
export default currentOrder.reducer