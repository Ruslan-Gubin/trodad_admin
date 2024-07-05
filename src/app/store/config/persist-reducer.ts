import { persistReducer } from "redux-persist";
import { storage } from "./storage";
import { rootReducer } from "./root-reducer";
 

export const persistedReducer = persistReducer(
  {
    key: "root",
    version: 1,
    timeout: 0,

    storage,
    blacklist: [
      // 'auth',
    ],
  },
  rootReducer
);
