const prompt = require('prompt-sync')()
const fse = require('fs-extra')
const exec = require('child_process').exec
const { parallel } = require('gulp')

function updateExtensionInfos(res) {
    console.log("Please provide the following extension information:")

    let manifest = {
        version: '0.0.1'
    }

    manifest.name = prompt("Name: ")
    manifest.description = prompt("Description: ")
    manifest.namespace = prompt("Namespace: ")
    manifest.author = prompt("Author: ")

    fse.writeFile("manifest.json", JSON.stringify(manifest, null, 4))

    console.log("Extension has been initialized!\n")
    console.log("[INFO]: Please run `docker-compose up -d` once to pull espocrm!")
    res()
}

function updateComposerInfos(res) {
    let composer = JSON.decode(fse.readFileSync("composer.json"))
    let { manifest } = require('../config')

    composer.name = manifest.author + "/" + manifest.slug
    composer.description = manifest.description
    composer.version = manifest.version
    composer.authors = [{
        name: manifest.author
    }]

    fse.writeFileSync("composer.json", JSON.stringify(composer, null, 4))
    res()
}

function updateNpmInfos(res) {
    let npm = JSON.decode(fse.readFileSync("package.json"))
    let { manifest } = require('../config')

    package.name = manifest.author + "/" + manifest.slug
    package.description = manifest.description
    package.version = manifest.version

    fse.writeFileSync("package.json", JSON.stringify(package, null, 4))
}

exports.init = series(updateExtensionInfos, updateComposerInfos, updateNpmInfos)