import { useAppSelector } from "../model";
import { authSlice } from "./slice";


const authSelect = (state: RootState) => state.auth;
export const authAction = authSlice.actions;
export const authReducer = authSlice.reducer;


export const useAuthSelect = () => {
  return useAppSelector(authSelect);
};
