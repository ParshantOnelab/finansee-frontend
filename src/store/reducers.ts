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
export const adminLoggedInReducer = createSlice({
    name: "isAdminLoggedIn",
    initialState: "No",
    reducers: {
        setIsAdminLoggedIn: (_state, action) => {
            return action.payload;
        }
    }
})

export const { setCustomersData } = customersReducer.actions;
export const { setUserRole } = userRoleReducer.actions;
export const { setIsAdminLoggedIn } = adminLoggedInReducer.actions;
const rootReducer = combineReducers({
    customer: customersReducer.reducer,
    user: userRoleReducer.reducer,
    adminLoggedIn: adminLoggedInReducer.reducer
})
export default rootReducer;
