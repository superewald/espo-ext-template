const fs = require('fs');

const extension = JSON.parse(fs.readFileSync('extension.json'));

const config = {};

config.appID = extension.module
config.clientID = extension.module.replace(/[A-Z]/g, m => "-" + m.toLowerCase())

exports.default = config
exports.config = config
exports.extension = extension