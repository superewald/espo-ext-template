const { watch } = require('./tasks/watch')
const { copy } = require('./tasks/copy')
const { dist } = require('./tasks/distribute')
const { init } = require('./tasks/init')

module.exports = {
    watch,
    copy,
    dist,
    init
}