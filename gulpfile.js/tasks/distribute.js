const { src, dest, parallel, watch } = require('gulp');
const fse = require('fs-extra');
const { config, extension } = require('../config');
const zip = require('gulp-zip')
const zl = require('zip-lib')

function distribute() {
    return new Promise((resolve, reject) => {
        let tmpDir = './dist/tmp'
        if(!fse.existsSync(tmpDir)) {
            fse.mkdirSync(tmpDir, {recursive: true})
        }

        let dirMap = {
            app: tmpDir + '/files/application/Espo/Modules/' + config.appID,
            client: tmpDir + '/files/client/modules/' + config.clientID,
            scripts: tmpDir + '/files/scripts'
        }

        Object.entries(dirMap).forEach(dm => {
            const [dir, dist] = dm
            fse.mkdirSync(dist, {recursive: true})
            fse.copySync(`./${dir}/`, dist)
        })
        fse.copyFileSync('extension.json', tmpDir + '/manifest.json')

        // copy composer vendor
        // copy npm node_modules

        zl.archiveFolder(tmpDir, `./dist/${manifest.clientID}.zip`).then(() => {
            fse.removeSync(tmpDir)
        })
        
        resolve()
    }
)}

exports.dist = distribute