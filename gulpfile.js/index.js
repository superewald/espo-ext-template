const { watch } = require('./tasks/watch')
const { copy } = require('./tasks/copy')
const { dist } = require('./tasks/distribute')

module.exports = {
    watch,
    copy,
    dist
}