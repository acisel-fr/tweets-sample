import { config } from 'dotenv';
import Tweets from '../lib';

config();
const token = process.env.TWITTER_BEARER_TOKEN;
if (!token) throw new Error('No token provided');

const callback = (data: object) => console.log(data);

const tweets = new Tweets(token, callback, ['created_at']);

tweets.emitter.on('info', obj => {
  console.log(obj);
});
tweets.emitter.on('warn', obj => {
  console.log(obj);
});
tweets.emitter.on('error', obj => {
  console.log(obj);
});

tweets.stream();
