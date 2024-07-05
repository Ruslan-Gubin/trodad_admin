import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";

import { persistedReducer } from "./config";
import { serializable } from "./middleware";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(serializable),
});

setupListeners(store.dispatch);

export const persist = persistStore(store);

export type AppDispatch = typeof store.dispatch;
