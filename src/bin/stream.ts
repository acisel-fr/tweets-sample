import { config } from 'dotenv';
import Tweets from '../lib';

config();
const token = process.env.TWITTER_BEARER_TOKEN;
if (!token) throw new Error('No token provided');

const callback = (data: object) => console.log(data);

const tweets = new Tweets(token, callback, ['created_at']);
tweets.events
  .filter(event => event !== 'DATA')
  .forEach(event => {
    tweets.emitter.on(event, data => {
      console.log(event, data);
    });
  });
tweets.stream();
