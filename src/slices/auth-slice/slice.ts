import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./init";
import { reducers } from "./reducers";

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers,
});

