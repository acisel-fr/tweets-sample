import { get } from 'https';
import store from '../store';
import type { Data, DataResponse, Options } from '../types';

export default function (options: Options, callback: (arg0: Data) => void) {
  get(options, response => {
    const status = response.statusCode;
    const rateLimit = {
      limit: response.headers['x-rate-limit-limit'],
      remaining: response.headers['x-rate-limit-remaining'],
      reset: response.headers['x-rate-limit-reset'],
    };
    if (status === 200) {
      // Start connection
      let current = 0,
        last = 0;
      setInterval(() => {
        // warn if empty connection
        if (current === last) {
          throw new Error(
            `No data or heartbeat during ${
              store.getState().constants.heartbeatInterval
            } ms`
          );
        } else {
          last = current;
        }
      }, store.getState().constants.heartbeatInterval);
      // Authentication and query succeed
      response.setEncoding('utf8');
      let data: string = '';
      response.on('data', (chunk: string) => {
        ++current;
        console.log(current, last);
        data += chunk;
        if (!data.match(/[\r\n]$/)) {
          // data uncomplete
        } else if (data.match(/^[\r\n]*\{.+\}[\r\n]+$/)) {
          // looks like a JSON
          try {
            const json: DataResponse = JSON.parse(data);
            data = '';
            if (json.data) {
              callback(json.data);
            } else {
              throw new Error(`No data sent: ${json}`);
            }
          } catch (error) {
            // Malformed JSON
            throw error;
          }
        } else if (data.match(/^[\n\r]+$/)) {
          // Heartbeat
        } else {
          // Unknown
          throw new Error(`Twitter sends: |${data}|`);
        }
      });
      response.on('end', () => {
        throw new Error('End of the stream');
      });
    } else {
      throw new Error(`Status error: ${status}`);
    }
  });
}
