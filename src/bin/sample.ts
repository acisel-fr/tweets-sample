import { config } from 'dotenv';
import Tweets from '../lib';

config();

const token = process.env.TWITTER_BEARER_TOKEN;
const fields = ['created_at'];
const timeOut = 5000;
const tweets = new Tweets({ token, fields, timeOut });

['data', 'info', 'warn', 'error'].forEach(eventType => {
  tweets.emitter.on(eventType, obj => {
    console.log(obj);
  });
});

tweets.stream();
