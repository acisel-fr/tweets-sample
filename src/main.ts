import setup from './setup';
import tweets from './twitter/sample';
import store from './store';
import { Data } from './types';

(function () {
  setup();
  const hostname = store.getState().constants.hostname;
  const path =
    store.getState().constants.path.stream_sample_tweets +
    '?tweet.fields=created_at';
  const options = {
    hostname: hostname,
    path: path,
    headers: {
      Authorization: `Bearer ${store.getState().constants.bearer_token}`,
    },
  };
  const callback = (tweet: Data) => {
    if (tweet.created_at) {
      console.log(tweet.created_at);
    } else {
      throw new Error('no date in tweet')
    }
  };
  tweets(options, callback);
})();
