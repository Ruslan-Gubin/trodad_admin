import { AsyncThunkPayloadCreator, createAsyncThunk, AsyncThunkOptions } from "@reduxjs/toolkit";
import { AppDispatch } from "../../app/store";



type AppThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}

export const createAppThunk = <Returned, ThunkArg = void> (
  type: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, AppThunkConfig>,
  options?: AsyncThunkOptions<ThunkArg, AppThunkConfig>,
) => {
  return createAsyncThunk(type, payloadCreator, options);
}