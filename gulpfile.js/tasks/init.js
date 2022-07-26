const prompt = require('prompt-sync')()
const { execSync } = require('child_process')
const fse = require('fs-extra')

function updateExtensionInfos(res) {
    let config = {
        acceptableVersions: [
            ">=7.0.0"
        ],
        php: [
            ">=7.3"
        ]
    }

    console.log("Please provide the following extension information:")

    config.name = prompt("Name: ")
    config.module = prompt("Module Name (CamelCase): ")
    config.description = prompt("Description: ")
    
    config.author.name = prompt("Author Name [git.user.name]: ")
    if(config.author.name == "")
        config.author.name = execSync("git config --global user.name", { encoding: 'utf-8' })

    config.author.email = prompt("Author Email [git.user.email]: ")
    if(config.author.email == "")
        config.author.email = execSync("git config --global user.email", { encoding: 'utf-8' })
    
    config.repository = prompt("Git repository url: ")

    console.log("Update composer.json")
    updateComposerInfos(config)
    console.log("Update package.json")
    updateNpmInfos(config)

    "Update extension.json"
    fse.writeFile("extension.json", JSON.stringify(config, null, 4))

    updateGitRepository(config)
    
    res()
}

function updateComposerInfos(config) {
    let composer = JSON.decode(fse.readFileSync("composer.json"))

    composer.name = config.author.toLowerCase() + "/" + config.module.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    composer.description = config.description
    composer.version = config.version
    composer.authors = [{
        name: config.author.name,
        email: config.author.email
    }]

    fse.writeFileSync("composer.json", JSON.stringify(composer, null, 4))
    res()
}

function updateNpmInfos(config) {
    let package = JSON.decode(fse.readFileSync("package.json"))

    package.name = config.author.toLowerCase() + "/" + config.module.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    package.description = config.description
    package.version = config.version
    package.author = config.author

    fse.writeFileSync("package.json", JSON.stringify(package, null, 4))
}

function updateGitRepository(config) {
    currentOrigin = execSync("git config --get remote.origin.url", {encoding: 'utf-8'})
    if(currentOrigin.endsWith("superewald/espo-ext-template")) {
        console.log("Update git repository remotes")
        rename = execSync("git rename origin upstream")
        newOrigin = execSync("git add remote origin " + config.repository)
    }
}

exports.init = updateExtensionInfos()