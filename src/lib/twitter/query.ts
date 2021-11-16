import store from '../store';

export default function () {
  const hostname = store.getState().constants.hostname;
  const path =
    store.getState().constants.path.stream_sample_tweets +
    '?tweet.fields=created_at';
  const bearer = store.getState().constants.bearer_token;
  const options = {
    hostname: hostname,
    path: path,
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  };
  return options;
}
