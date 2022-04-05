const { src, dest, parallel, watch } = require('gulp');
const fse = require('fs-extra');
const { config, manifest } = require('../config');
const exec = require('child_process').exec;

function copyFile(prefix, dist) {
    return (path, stats) => {
        let distPath = path.replace(prefix + "/", "./" + dist + "/" + (prefix == "app" ? manifest.appID : manifest.clientID) + "/")
        return fse.copy(path, distPath)
    }
}

function removeFile(prefix, dist) {
    return (path, stats) => {
        let distPath = path.replace(prefix + "/", "./" + dist + "/" + (prefix == "app" ? manifest.appID : manifest.clientID) + "/")
        return fse.unlink(distPath)
    }
}

function watchSource(prefix, dist) {
    const watcher = watch("./" + prefix + "/**/*")
    const copyAppFile = copyFile(prefix, dist)
    const removeAppFile = removeFile(prefix, dist)

    watcher.on('change', copyAppFile)
    watcher.on('add', copyAppFile)
    watcher.on('unlink', removeAppFile)
    return watcher
}

function watchExtension() {
    let extDir = "data/uploads/extensions/" + manifest.clientID + "/"
    const watcher = watch("./scripts/**/*")
    const distPath = (path) => {
        return path.replace("scripts/", "site/" + extDir + "scripts/")
    }

    const installExtension = () => {
        exec('sudo podman exec espocrm php devextension.php install '+ extDir, (err, stdout, stderr) => {
            if(err) {
                console.log(stderr)
            }
        })
    }

    const removeExtension = () => {
        exec('sudo podman exec espocrm php devextension.php uninstall ' + extDir, (err, stdout, stderr) => {
            //console.log(stdout)
            if(err) {
                console.log(stderr)
            }
        })
    }

    const updateExtension = () => {
        removeExtension()
        installExtension()
    }

    watcher.on('change', (path, stats) => {
        fse.copy(path, distPath(path))
        updateExtension()
    });

    watcher.on('unlink', (path, stats) => {
        fse.unlink(distPath(path))
        updateExtension()
    });

    return watcher;
}

const watchAppFiles = () => {
    return watchSource("app", "site/application/Espo/Modules")
}

const watchClientFiles = () => {
    return watchSource("client", "site/client/modules/")
}


module.exports = {
    watchAppFiles,
    watchClientFiles,
    watchExtension,
    watchSource: () => {
        watchAppFiles()
        watchClientFiles()
    },
    watch: () => {
        watchAppFiles()
        watchClientFiles()
        watchExtension()
    }
}