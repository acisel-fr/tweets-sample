#!/usr/bin/env node

import { setup, Data, query, tweets } from '../lib';

(function () {
  setup();
  const callback = (tweet: Data) => {
    if (tweet.created_at) {
      console.log(tweet.created_at);
    } else {
      throw new Error('no date in tweet');
    }
  };
  const options = query();
  try {
    tweets(options, callback);
  } catch (error) {
    console.error(error);
  }
})();
