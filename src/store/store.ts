import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { customersReducer,userReducer } from './reducers'

export const store = configureStore({
  reducer: {
    [api.reducerPath]:api.reducer,
    [customersReducer.name]: customersReducer.reducer,
    [userReducer.name]: userReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch