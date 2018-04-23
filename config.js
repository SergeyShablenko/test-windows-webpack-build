const Path = require('path');

module.exports = {
  mode: 'local',
  host: 'localhost',
  port: 3001,
  proxy: 'http://192.168.1.3:8080',
  api: ['/api'],
  root: Path.resolve(`${__dirname}/../`),
  entry: Path.resolve(`${__dirname}/app`),
  dest: Path.resolve(`${__dirname}/../resources/static`),
  publicPath: '/'
};
