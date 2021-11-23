import { url } from './url';

export interface Options {
  hostname: string;
  path: string;
  headers: any;
}

export default function (token: string, fields?: string[]): Options {
  /** Build path with fields wanted */
  let path = url.path;
  if (fields && fields.length > 0) {
    path += '?tweet.fields=' + fields.join(',');
  }

  /** Build options of Get */
  const options = {
    hostname: url.hostname,
    path: path,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return options;
}
