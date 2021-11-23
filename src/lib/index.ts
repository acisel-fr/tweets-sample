import sample from './twitter/sample';
import query from './twitter/query';
import EventEmitter from 'events';
import { NO_TWITTER_TOKEN } from './signal/events';
import buildSignal from './signal';
export default class {
  emitter: EventEmitter;
  signal: (sign: string, data?: object | undefined) => void;
  token: string | undefined;
  fields: string[] | undefined;
  timeOut: number;

  constructor({
    token,
    fields,
    timeOut,
  }: {
    token: string | undefined;
    fields?: string[];
    timeOut?: number;
  }) {
    this.emitter = new EventEmitter();
    this.signal = buildSignal(this.emitter);
    this.token = token;
    this.fields = fields;
    this.timeOut = timeOut || 10000;
  }

  stream() {
    if (!this.token) return this.signal(NO_TWITTER_TOKEN);
    const options = query(this.token, this.fields);
    const signal = this.signal;
    const timeOut = this.timeOut;
    sample({ signal, timeOut, options });
  }
}
