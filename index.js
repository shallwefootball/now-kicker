require('now-env');

const { send } = require('micro');
const { router, get } = require('microrouter');
const fetch = require('node-fetch');
const _ = require('lodash');
const { NOW_API } = process.env;

console.log('NOW_API', NOW_API);

const API_PATH = 'https://api.zeit.co/v2/now/deployments';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${NOW_API}`
};

const redirect = name => async (req, res) => {
  const { deployments } = await fetch(API_PATH, { headers }).then(res =>
    res.json()
  );
  const index = _.findIndex(deployments, { name });
  const { url } = deployments[index];
  res.statusCode = 302;
  res.setHeader('Location', `https://${url}`);
  res.end();
};

const paths = ['easing-sheet', 'madrid-passing-chord'];
const routes = paths.map(path => get('/' + path, redirect(path)));

module.exports = router(...routes);
