import tweets from './twitter/sample';
import query from './twitter/query';
import EventEmitter from 'events';
import {
  CONNECTED,
  CONNECTING,
  WRONG_STATUS,
  CONN_INACTIVE,
  RATE_LIMITS,
  CONN_END,
  HEARTBEAT,
  CHUNK,
  NOT_JSON,
  NOT_TWEET,
  DATA,
  OK_STATUS,
  CONN_ACTIVE,
  signal,
} from './constants/signals';
export default class {
  token: string;
  fields: string[] | undefined;
  emitter: EventEmitter;
  events: any[];
  signal: (sign: string, data?: object | undefined) => void;

  constructor(token: string, fields?: string[]) {
    this.token = token;
    this.fields = fields;
    this.emitter = new EventEmitter();
    this.signal = signal(this.emitter);
    this.events = [
      CONNECTED,
      CONNECTING,
      WRONG_STATUS,
      CONN_INACTIVE,
      RATE_LIMITS,
      CONN_END,
      HEARTBEAT,
      CHUNK,
      NOT_JSON,
      NOT_TWEET,
      DATA,
      OK_STATUS,
      CONN_ACTIVE,
    ];
  }

  stream() {
    const options = query(this.token, this.fields);

    tweets(options, this.signal);
  }
}
