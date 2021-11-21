import tweets from './twitter/sample';
import query from './twitter/query';

export default class {
  token: string;
  callback: (data: object) => void;
  fields: string[] | undefined;

  constructor(
    token: string,
    callback: (data: object) => void,
    fields?: string[]
  ) {
    this.token = token;
    this.fields = fields;
    this.callback = callback;
  }

  stream() {
    const options = query(this.token, this.fields);
    tweets(options, this.callback);
  }
}
