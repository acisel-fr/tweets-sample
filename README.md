# 1% of all tweets

[![DOI](https://zenodo.org/badge/428581047.svg)](https://zenodo.org/badge/latestdoi/428581047)

Missing features

- [ ] npm registry
- [ ] github registry
- [ ] cli
- [ ] demo
- [ ] docs
- [ ] i18n
- [ ] a11y
- [ ] perf

```ts
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
```
