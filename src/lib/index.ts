import sample from './twitter/sample';
import query from './twitter/query';
import EventEmitter from 'events';
import {
  NO_TWITTER_TOKEN,
  OFFLINE,
  ONLINE,
  TWITTER_API_OFFLINE,
  TWITTER_API_ONLINE,
} from './signal/events';
import buildSignal from './signal';
import online from './network/online';
const ping = require('ping');
import { url } from './twitter/url';
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

  async stream() {
    const signal = this.signal;
    if (!(await online())) return signal(OFFLINE);
    signal(ONLINE);
    const api = await ping.promise.probe(url.hostname);
    if (!api.alive) return signal(TWITTER_API_OFFLINE);
    signal(TWITTER_API_ONLINE);
    if (!this.token) return signal(NO_TWITTER_TOKEN);
    const options = query(this.token, this.fields);
    const timeOut = this.timeOut;
    sample({ signal, timeOut, options });
  }
}
