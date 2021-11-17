#!/usr/bin/env node

import { setup, query, tweets } from '../lib';

(function () {
  try {
    setup();
    const options = query(['created_at']);
    tweets(options, data => console.log(data));
  } catch (error) {
    console.error(error);
  }
})();
