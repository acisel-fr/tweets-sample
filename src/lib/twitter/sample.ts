import { get } from 'https';
import type EventEmitter from 'events';
import { twitter } from '../constants/twitter';
import { Options } from './query';
import {
  CONNECTED,
  CONNECTING,
  WRONG_STATUS,
  CONN_INACTIVE,
  RATE_LIMITS,
  OK_STATUS,
  CONN_END,
  HEARTBEAT,
  CHUNK,
  NOT_JSON,
  NOT_TWEET,
  DATA,
  CONN_ACTIVE,
} from '../constants/signals';
import type { IncomingMessage } from 'http';

export default function (options: Options, signal: EventEmitter) {
  signal.emit(CONNECTING);
  get(options, response => {
    signal.emit(CONNECTED);
    signal.emit(RATE_LIMITS, ratesSelector(response));
    const status = response.statusCode;
    if (status === 200) {
      signal.emit(OK_STATUS);

      /** Watch if connection get inactive */
      const heartbeat = twitter.heartbeatInterval;
      let current = 0;
      let last = 0;
      setInterval(() => {
        if (current === last) {
          signal.emit(CONN_INACTIVE);
        } else {
          signal.emit(CONN_ACTIVE);
          last = current;
        }
      }, heartbeat);

      /** Data analysis */
      let data: string = '';
      response.setEncoding('utf8');
      response.on('data', (chunk: string) => {
        ++current;
        if (chunk.match(/^[\n\r]*$/)) return signal.emit(HEARTBEAT);
        data += chunk;
        if (!data.match(/[\r\n]$/)) return signal.emit(CHUNK);
        try {
          // should be a JSON
          const json: DataResponse = JSON.parse(data);
          data = '';
          if (json.data) {
            signal.emit(DATA, json.data);
          } else {
            const type = JSON.stringify(json);
            signal.emit(NOT_TWEET, type);
          }
        } catch (error) {
          const format = JSON.stringify(data);
          signal.emit(NOT_JSON, format);
        }
      });

      response.on('end', () => {
        signal.emit(CONN_END);
      });
    } else {
      signal.emit(WRONG_STATUS, status, response);
    }
  });
}

function ratesSelector(res: IncomingMessage) {
  const head = res.headers;
  return {
    limit: head['x-rate-limit-limit'],
    remain: head['x-rate-limit-remaining'],
    reset: head['x-rate-limit-reset'],
  };
}

export interface DataResponse {
  data: object;
}
