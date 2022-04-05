const { src, dest, parallel, watch } = require('gulp');
const fse = require('fs-extra');
const { config, manifest } = require('../config');
const zip = require('gulp-zip')
const zl = require('zip-lib')

function distribute() {
    return new Promise((resolve, reject) => {
        let tmpDir = './dist/tmp'
        if(!fse.existsSync(tmpDir)) {
            fse.mkdirSync(tmpDir, {recursive: true})
        }

        let dirMap = {
            app: tmpDir + '/files/application/Espo/Modules/' + manifest.appID,
            client: tmpDir + '/files/client/modules/' + manifest.clientID,
            scripts: tmpDir + '/files/scripts'
        }

        Object.entries(dirMap).forEach(dm => {
            const [dir, dist] = dm
            console.log(dir)
            console.log(dist)
            fse.mkdirSync(dist, {recursive: true})
            fse.copySync(`./${dir}/`, dist)
        })
        fse.copyFileSync('manifest.json', tmpDir + '/manifest.json')

        // copy composer vendor
        // copy npm node_modules

        zl.archiveFolder(tmpDir, `./dist/${manifest.clientID}.zip`).then(() => {
            fse.removeSync(tmpDir)
        })
        
        resolve()
    }
)}

exports.dist = distribute