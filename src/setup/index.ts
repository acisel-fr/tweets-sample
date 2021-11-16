import { config } from 'dotenv';
import store from '../store';
import { set } from '../store/constants';

export default function () {
  const result = config();
  if (result.error) throw result.error;
  if (result.parsed) store.dispatch(set(result.parsed.TWITTER_BEARER_TOKEN));
}
