import { combineReducers, createSlice } from "@reduxjs/toolkit";

interface Customer {
    customer_id: string;
    match_score: number;
}

interface User {
    email: string;
    role: string;
    id: string
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
export const userReducer = createSlice({
    name: "user",
    initialState: { email: "", role: "", id: "" } as User,
    reducers: {
        setUserData: (_state, action) => {
            return action.payload;
        }
    }
})

export const { setCustomersData } = customersReducer.actions;
export const { setUserData } = userReducer.actions;
const rootReducer = combineReducers({
    customer: customersReducer.reducer,
    user: userReducer.reducer
})
export default rootReducer;
