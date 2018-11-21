require('now-env');

const { NOW_API, NODE_ENV } = process.env;
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fetch = require('node-fetch');
const _ = require('lodash');

const API_PATH = 'https://api.zeit.co/v2/now/deployments';
const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${NOW_API}`
};

const dev = NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    const path = pathname.replace(/\//, '');

    const { deployments } = await fetch(API_PATH, {
      headers: HEADERS
    }).then(res => res.json());

    const index = _.findIndex(deployments, { name: path });

    if (index > -1) {
      const { url } = deployments[index];
      app.render(req, res, '/', { redirectPath: `https://${url}` });
    }
    handle(req, res, parsedUrl);
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
