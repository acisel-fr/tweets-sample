# 1% of all tweets

[![DOI](https://zenodo.org/badge/428581047.svg)](https://zenodo.org/badge/latestdoi/428581047)

## Start a project with our library

### With [nodejs](https://nodejs.org/en/) (version > 16.13.0)

The module is in the GitHub registry. So, specify in your `${HOME}/.npmrc` file the following lines:

```
registry=https://registry.npmjs.org/
@acisel-fr:registry=https://npm.pkg.github.com/
```

Then, you can install it in your project folder:

```bash
mkdir MYPROJECT
cd MYPROJECT
npm init
npm install @acisel-fr/tweets-sample
```

Create an `.env` file with this content:

```bash
TWITTER_BEARER_TOKEN=
```

And append to it your bearer token. To obtain a token, visit the [developper portal](https://developer.twitter.com/en/portal/dashboard) of Twitter.

Afterwards, create a script file `run.js`:

```js

```

And run the script:

```
node ./run.js
```

You will see then 1% of all the tweets emitted in real time.

### With Docker

## Missing features

- [ ] cli
- [ ] demo
- [ ] docs
- [ ] i18n
- [ ] a11y
- [ ] perf
