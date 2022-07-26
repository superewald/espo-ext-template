#!/bin/bash

# extension.json template
EXT_CONFIG_TPL='{
    "module": "%s",
    "name": "%s",
    "description": "%s",
    "author": {
        "name": "%s",
        "email": "%s"
    },
    "repository": "%s",
    "acceptableVersions": [
        ">=7.0.0"
    ],
    "php": [
        ">=7.3"
    ]
}
'

EXT_COMPOSER_TPL='{
    "name": "%s",
    "description": "%s",
    "authors": [
        {
            "name": "%s",
            "email": "%s"
        }
    ],
    "require": {},
    "autoload": {
        "psr-4": {
            "Espo\\\\Modules\\\\%s": "app/"
        }
    }
}
'

EXT_PACKAGE_TPL='{
    "name": "%s",
    "description": "%s",
    "author": {
        "name": "%s",
        "email": "%s"
    }
}
'

EXT_AUTOLOAD_TPL='{
    "autoloadFileList": [
        "application/Espo/Modules/%s/vendor/autoload.php"
    ]
}
'


# read extension config
echo "Please provide the following information: "

read -p "Extension Name (eg: Awesome Extension): " extName
if [[ "$extName" == "" ]]; then
    echo "ERROR: please provide extension name!"
    exit
fi

read -p "Extension Module Name (eg: AwesomeExtension): " extModuleName
if [[ "$extModuleName" == "" ]]; then
    echo "ERROR: please provide module name!"
    exit
fi

extModuleNameHyphen=$(sed --expression 's/\([A-Z]\)/-\L\1/g' --expression 's/^-//' <<< "$extModuleName")

read -p "Extension Description: " extDescription

read -p "Extension Author Name (eg: SuperEwald) [git.user.name]: " extAuthorName
if [[ "$extAuthorName" == "" ]]; then
    extAuthorName=$(git config --global user.name)
fi

read -p "Extension Author Email [git.user.email]: " extAuthorEmail
if [[ "$extAuthorEmail" == "" ]]; then
    extAuthorEmail=$(git config --global user.email)
fi

read -p "Extension Git Repository: " extRepository


printf -v EXT_CONFIG_CONF "$EXT_CONFIG_TPL" "$extModuleName" "$extName" "$extDescription" "$extAuthorName" "$extAuthorEmail" "$extRepository"
printf -v EXT_COMPOSER_CONF "$EXT_COMPOSER_TPL" "$extAuthorName/$extModuleNameHyphen" "$extDescription" "$extAuthorName" "$extAuthorEmail" "$extModuleName"
printf -v EXT_PACKAGE_CONF "$EXT_PACKAGE_TPL" "$extAuthorName/$extModuleNameHyphen" "$extDescription" "$extAuthorName" "$extAuthorEmail"
printf -v EXT_AUTOLOAD_CONF "$EXT_AUTOLOAD_TPL" "$extModuleName"

echo ""
echo "Writing infos to extension.json, package.json and composer.json"

echo "$EXT_PACKAGE_CONF" > package.json
echo "$EXT_CONFIG_CONF" > extension.json
echo "$EXT_COMPOSER_CONF" > composer.json
echo "$EXT_AUTOLOAD_CONF" > app/Resources/autoload.json

echo ""
echo "Update git remotes"

currentOrigin=$(git config --get remote.origin.url)
if [[ "$currentOrigin" == *"superewald/espo-ext-template"* ]]; then
    git remote rename origin upstream
    git remote add origin "$extRepository"
    rm ./init.sh
    git commit -m "initial commit"
    git push -u origin main
fi

echo ""
echo "Extension template was initialized and is ready to be built!"