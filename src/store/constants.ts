import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { twitter_api } from '../default';
import type { ConstantsState } from '../types';

const initialState: ConstantsState = {
  bearer_token: undefined,
  ...twitter_api,
};

export const constantsSlice = createSlice({
  name: 'constants',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      state.bearer_token = action.payload;
    },
  },
});

export const { set } = constantsSlice.actions;

export default constantsSlice.reducer;
