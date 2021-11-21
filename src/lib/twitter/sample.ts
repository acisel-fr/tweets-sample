import { get } from 'https';
import { twitter } from '../constants/twitter';
import { Options } from './query';

export interface DataResponse {
  data: object;
}

export default function (options: Options, callback: (arg0: any) => void) {
  get(options, response => {
    const status = response.statusCode;
    const rateLimit = {
      status: status,
      limit: response.headers['x-rate-limit-limit'],
      remain: response.headers['x-rate-limit-remaining'],
      reset: response.headers['x-rate-limit-reset'],
    };
    if (status === 200) {
      // Start connection
      const heartbeat = twitter.heartbeatInterval;
      let current = 0,
        last = 0;
      setInterval(() => {
        // warn if empty connection
        if (current === last) {
          throw new Error(
            `No data or heartbeat during ${heartbeat} ms. Ticks ${last}/${current}`
          );
        } else {
          last = current;
        }
      }, heartbeat);
      // Authentication and query succeed
      response.setEncoding('utf8');
      let data: string = '';
      response.on('data', (chunk: string) => {
        ++current;
        // Heartbeat
        if (chunk.match(/^[\n\r]*$/)) return;
        data += chunk;
        // Part of data only. Wait for the completion
        if (!data.match(/[\r\n]$/)) return;
        // Data complete
        try {
          // should be a JSON
          const json: DataResponse = JSON.parse(data);
          data = '';
          if (json.data) {
            callback(json.data);
          } else {
            // Not an awaited type
            const type = JSON.stringify(json);
            throw new Error(`Another type of data has been sent: ${type}`);
          }
        } catch (error) {
          // Not a JSON format
          const format = JSON.stringify(data);
          throw new Error(`Bad format: |${format}|`);
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
