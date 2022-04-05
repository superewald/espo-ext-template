const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('manifest.json'));

const config = {};

manifest.appID = manifest.namespace.replaceAll("\\", "")
manifest.clientID = manifest.namespace.replaceAll("\\", "-").toLowerCase()


exports.default = config
exports.config = config
exports.manifest = manifest