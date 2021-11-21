import { get } from 'https';
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
import { DateTime } from 'luxon';

export default function (
  options: Options,
  signal: (sign: string, data?: any) => void
) {
  signal(CONNECTING);
  get(options, response => {
    signal(CONNECTED);
    signal(RATE_LIMITS, ratesSelector(response));
    const status = response.statusCode;
    if (status === 200) {
      signal(OK_STATUS);

      /** Watch if connection get inactive */
      const heartbeat = twitter.heartbeatInterval;
      let current = 0;
      let last = 0;
      setInterval(() => {
        if (current === last) {
          signal(CONN_INACTIVE);
        } else {
          signal(CONN_ACTIVE);
          last = current;
        }
      }, heartbeat);

      /** Data analysis */
      let data: string = '';
      response.setEncoding('utf8');
      response.on('data', (chunk: string) => {
        ++current;
        if (chunk.match(/^[\n\r]*$/)) return signal(HEARTBEAT);
        data += chunk;
        if (!data.match(/[\r\n]$/)) return signal(CHUNK);
        try {
          // should be a JSON
          const json: DataResponse = JSON.parse(data);
          data = '';
          if (json.data) {
            signal(DATA, json.data);
          } else {
            const type = JSON.stringify(json);
            signal(NOT_TWEET, type);
          }
        } catch (error) {
          const format = JSON.stringify(data);
          signal(NOT_JSON, format);
        }
      });

      response.on('end', () => {
        signal(CONN_END);
      });
    } else {
      signal(WRONG_STATUS, { status, response });
    }
  });
}

function ratesSelector(res: IncomingMessage) {
  const head = res.headers;
  const reset = head['x-rate-limit-reset'] as string;
  const date = DateTime.fromMillis(parseInt(reset) * 1000).toISO();
  return {
    limit: head['x-rate-limit-limit'],
    remain: head['x-rate-limit-remaining'],
    reset: date,
  };
}

export interface DataResponse {
  data: object;
}
