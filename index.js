const { cli } = require('./src/cli');
const chromeOpts = require('./config/chromeOpts.json')

cli('https://github.com/login', 2, chromeOpts)