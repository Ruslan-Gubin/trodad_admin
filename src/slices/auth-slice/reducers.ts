import { PayloadAction } from "@reduxjs/toolkit";
import { AuthInitState } from "./types";


export const reducers = {

  loginAuth(state: AuthInitState, action: PayloadAction<{ username: string }>) {
    state.authorization = true;
    state.username = action.payload.username;
  },

  logoutAuth(state: AuthInitState) {
    state.authorization = false;
    state.username = '';
  },
  
};
