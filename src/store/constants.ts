import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConstantsState {
  bearer_token: string | undefined;
  hostname: string;
  path: {
    stream_sample_tweets: string;
  };
}

const initialState: ConstantsState = {
  bearer_token: undefined,
  hostname: 'api.twitter.com',
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
