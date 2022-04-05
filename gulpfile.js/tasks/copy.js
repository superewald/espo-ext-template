const {src, dest, parallel, series} = require('gulp');
const fse = require('fs-extra');

const { config, manifest } = require('../config');

function copyAppFiles() {
    return fse.copy("./app", "./site/application/Espo/Modules/" + manifest.appID)
}

function copyClientFiles() {
    return fse.copy("./client", "./site/client/modules/" + manifest.clientID)
}

function copyManifestAndScripts() {
    let extUploadDir = "site/data/uploads/extensions/" + manifest.clientID + "/"
    
    fse.copySync("devextension.php", "site/devextension.php");
    return src(["manifest.json", "scripts/*.php"], { base: './'})
        .pipe(dest(extUploadDir))
    
}

module.exports = {
    copyAppFiles,
    copyClientFiles,
    copyManifestAndScripts,
    copy: parallel(copyAppFiles, copyClientFiles, copyManifestAndScripts)
}