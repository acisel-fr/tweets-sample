import type { EventEmitter } from 'stream';
import { DateTime } from 'luxon';
import {
  ONLINE,
  OFFLINE,
  TWITTER_API_ONLINE,
  TWITTER_API_OFFLINE,
  OAUTH_SUCCESS,
  OAUTH_FAIL,
  NO_TWITTER_TOKEN,
  CONNECTING,
  WRONG_STATUS,
  TIMEOUT,
  OK_STATUS,
  RATE_LIMITS,
  CONNECTED,
  HEARTBEAT,
  CHUNK,
  TWEET,
  NOT_JSON,
  NOT_TWEET,
  CONN_INACTIVE,
  CONN_ACTIVE,
  CONN_END,
} from './events';

export type Signal = (sign: string, data?: object) => void;

/** Build a function */
export default function (emitter: EventEmitter) {
  const signal = (sign: string, data?: object): void => {
    const date = DateTime.now().toISO();
    if (sign === OFFLINE)
      emitter.emit('info', { event: OFFLINE, receivedAt: date });
    if (sign === ONLINE)
      emitter.emit('info', { event: ONLINE, receivedAt: date });

    if (sign === NO_TWITTER_TOKEN)
      emitter.emit('error', { event: NO_TWITTER_TOKEN, receivedAt: date });

    if (sign === CONNECTING)
      emitter.emit('info', { event: CONNECTING, receivedAt: date });
    if (sign === TIMEOUT)
      emitter.emit('error', { event: TIMEOUT, receivedAt: date });

    if (sign === CONNECTED)
      emitter.emit('info', { event: CONNECTED, receivedAt: date });
    if (sign === RATE_LIMITS)
      emitter.emit('info', { event: RATE_LIMITS, receivedAt: date, data });

    if (sign === WRONG_STATUS)
      emitter.emit('error', { event: WRONG_STATUS, receivedAt: date, data });
    if (sign === OK_STATUS)
      emitter.emit('info', { event: OK_STATUS, receivedAt: date });
    if (sign === CONN_INACTIVE)
      emitter.emit('error', { event: CONN_INACTIVE, receivedAt: date });
    if (sign === CONN_ACTIVE)
      emitter.emit('info', { event: CONN_ACTIVE, receivedAt: date });

    if (sign === HEARTBEAT)
      emitter.emit('info', { event: HEARTBEAT, receivedAt: date });
    if (sign === CHUNK)
      emitter.emit('info', { event: CHUNK, receivedAt: date });
    if (sign === NOT_JSON)
      emitter.emit('warn', { event: NOT_JSON, receivedAt: date, data });
    if (sign === NOT_TWEET)
      emitter.emit('warn', { event: NOT_TWEET, receivedAt: date, data });
    if (sign === TWEET)
      emitter.emit('data', { event: TWEET, receivedAt: date, data });

    if (sign === CONN_END)
      emitter.emit('info', { event: CONN_END, receivedAt: date });
  };
  return signal;
}
