import { get } from 'https';
import store from '../store';

export default function () {
  const options = {
    hostname: store.getState().constants.hostname,
    path: store.getState().constants.path.stream_sample_tweets,
    headers: {
      Authorization: `Bearer ${store.getState().constants.bearer_token}`,
    },
  };

  get(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', chunk => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
}
