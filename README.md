# pwa-worker

## 1. installation

```bash
$ npm i pwa-worker --save-dev
```

## 2. copy worker

assuming `public` is your folder with static files

```bash
$ cp node_modules/pwa-worker/worker.js public
```

## 3. usage in code

```js
import register from 'pwa-worker'

register()
```

## 4. result

- your service worker makes your page run offline

- first getting fresh requests, and falling back on cache
