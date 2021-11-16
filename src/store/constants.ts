import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConstantsState } from '../types';

const initialState: ConstantsState = {
  bearer_token: undefined,
  hostname: 'api.twitter.com',
  heartbeatInterval: 20000,
  path: {
    stream_sample_tweets: '/2/tweets/sample/stream',
  },
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
