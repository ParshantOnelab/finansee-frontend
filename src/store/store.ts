import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { api } from "./api";
import { customersReducer, userRoleReducer,adminLoggedInReducer } from "./reducers";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Step 1: Combine all reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [customersReducer.name]: customersReducer.reducer,
  [userRoleReducer.name]: userRoleReducer.reducer,
  [adminLoggedInReducer.name]: adminLoggedInReducer.reducer,
});

// Step 2: Set up persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: [customersReducer.name, userRoleReducer.name,adminLoggedInReducer.name], // only persist these
};

// Step 3: Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// Step 5: Export persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
