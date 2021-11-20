import store from '../store';

export default function (fields?: string[]) {
  const hostname = store.getState().constants.hostname;
  let path = store.getState().constants.path.stream_sample_tweets;
  if (fields && fields.length > 0) {
    path += '?tweet.fields=' + fields.join(',');
  }
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
