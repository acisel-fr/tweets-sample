export interface ConstantsState {
  bearer_token: string | undefined;
  hostname: string;
  heartbeatInterval: number;
  path: {
    stream_sample_tweets: string;
  };
}

export interface Options {
  hostname: string;
  path: string;
  headers: any;
}

export interface DataResponse {
  data: Data;
}

export interface Data {
  id: string;
  text: string;
  created_at?: string;
}
