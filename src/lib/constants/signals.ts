import type { EventEmitter } from 'stream';
import { DateTime } from 'luxon';

const OFFLINE = 'OFFLINE';
const NO_TWITTER_SERVER = 'NO_TWITTER_SERVER';
const OAUTH_SUCCESS = 'OAUTH_SUCCESS';
const OAUTH_FAIL = 'OAUTH_FAIL';

export const CONNECTING = 'CONNECTING';
export const WRONG_STATUS = 'WRONG_STATUS';
export const OK_STATUS = 'OK_STATUS';
export const RATE_LIMITS = 'RATE_LIMITS';

export const CONNECTED = 'CONNECTED';
export const HEARTBEAT = 'HEARTBEAT';
export const CHUNK = 'CHUNK';
export const DATA = 'DATA';
export const NOT_JSON = 'NOT_JSON';
export const NOT_TWEET = 'NOT_TWEET';

export const CONN_INACTIVE = 'CONN_INACTIVE';
export const CONN_ACTIVE = 'CONN_ACTIVE';

export const CONN_END = 'CONN_END';

export function signal(emitter: EventEmitter) {
  return (sign: any, data?: object) => {
    const date = DateTime.now().toISO();
    if (sign === CONNECTING)
      emitter.emit('info', { type: CONNECTING, receivedAt: date, data });
    if (sign === WRONG_STATUS)
      emitter.emit('error', { type: WRONG_STATUS, receivedAt: date, data });
    if (sign === OK_STATUS)
      emitter.emit('info', { type: OK_STATUS, receivedAt: date, data });
    if (sign === RATE_LIMITS)
      emitter.emit('info', { type: RATE_LIMITS, receivedAt: date, data });

    if (sign === CONNECTED)
      emitter.emit('info', { type: CONNECTED, receivedAt: date, data });
    if (sign === HEARTBEAT)
      emitter.emit('info', { type: HEARTBEAT, receivedAt: date, data });
    if (sign === CHUNK)
      emitter.emit('info', { type: CHUNK, receivedAt: date, data });
    if (sign === DATA)
      emitter.emit('data', { type: DATA, receivedAt: date, data });
    if (sign === NOT_JSON)
      emitter.emit('warn', { type: NOT_JSON, receivedAt: date, data });
    if (sign === NOT_TWEET)
      emitter.emit('warn', { type: NOT_TWEET, receivedAt: date, data });

    if (sign === CONN_INACTIVE)
      emitter.emit('error', { type: CONN_INACTIVE, receivedAt: date, data });
    if (sign === CONN_ACTIVE)
      emitter.emit('info', { type: CONN_ACTIVE, receivedAt: date, data });

    if (sign === CONN_END)
      emitter.emit('info', { type: CONN_END, receivedAt: date, data });
  };
}
