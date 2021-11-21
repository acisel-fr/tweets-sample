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
} from './constants/signals';
export default class {
  token: string;
  callback: (data: object) => void;
  fields: string[] | undefined;
  emitter: EventEmitter;
  events: any[];

  constructor(
    token: string,
    callback: (data: object) => void,
    fields?: string[]
  ) {
    this.token = token;
    this.fields = fields;
    this.callback = callback;
    this.emitter = new EventEmitter();
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

    tweets(options, this.emitter);
  }
}
