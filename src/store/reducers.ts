import { combineReducers, createSlice } from "@reduxjs/toolkit";

interface Customer {
    customer_id: string;
    match_score: number;
}



export const customersReducer = createSlice({
    name: "data",
    initialState: [] as Customer[],
    reducers: {
        setCustomersData: (_state, action) => {
            return action.payload;
        }
    }
})
export const userRoleReducer = createSlice({
    name: "userRole",
    initialState: "",
    reducers: {
        setUserRole: (_state, action) => {
            return action.payload;
        }
    }
})

export const { setCustomersData } = customersReducer.actions;
export const { setUserRole } = userRoleReducer.actions;
const rootReducer = combineReducers({
    customer: customersReducer.reducer,
    user: userRoleReducer.reducer
})
export default rootReducer;
