import { get } from 'https';
import { url } from './url';
import { Options } from './query';
import type { IncomingMessage } from 'http';
import { DateTime } from 'luxon';
import {
  OFFLINE,
  NO_TWITTER_SERVER,
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
} from '../signal/events';
import { Signal } from '../signal';

interface Sample {
  signal: Signal;
  timeOut: number;
  options: Options;
}

export default function ({ signal, timeOut, options }: Sample) {
  signal(CONNECTING);
  const clear = setTimeout(() => {
    signal(TIMEOUT);
  }, timeOut);

  get(options, response => {
    clearTimeout(clear);
    signal(CONNECTED);
    signal(RATE_LIMITS, ratesSelector(response));

    const status = response.statusCode;
    if (status === 200) {
      signal(OK_STATUS);

      /** Watch if connection get inactive */
      const heartbeat = url.heartbeatInterval;
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
            signal(TWEET, json.data);
          } else {
            signal(NOT_TWEET, json);
          }
        } catch (error) {
          const format = JSON.stringify(data);
          signal(NOT_JSON, { chunk: format });
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
