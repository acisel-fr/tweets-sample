import { get } from 'https';
import store from '../store';
import type { Data, DataResponse, Options } from '../types';

export default function (options: Options, callback: (arg0: Data) => void) {
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
