#!/bin/bash

tempDir="./tmp/"
if [[ -d "$tempDir" ]]; then
    rm -r "$tempDir"
fi
mkdir -p "$tempDir"


# get extension name
moduleName=$(jq -r .module ./extension.json)
moduleNameHyphen=$(sed --expression 's/\([A-Z]\)/-\L\1/g' --expression 's/^-//' <<< "$moduleName")

if [[ -f "$moduleNameHyphen.zip" ]]; then
    rm "$moduleNameHyphen.zip"
fi

# copy app and client dir
appDestDir="$tempDir/files/application/Espo/Modules/$moduleName"
clientDestDir="$tempDir/files/client/modules/$moduleNameHyphen"

mkdir -p "$appDestDir"
mkdir -p "$clientDestDir"

cp -r "./app/." "$appDestDir/"
cp -r "./vendor/." "$appDestDir/vendor/"
cp -r "./client/." "$clientDestDir/"

# copy scripts and manifest
cp -r "./scripts/." "$tempDir/scripts/"
cp "extension.json" "$tempDir/manifest.json"

(cd "$tempDir"; zip -r "../$moduleNameHyphen.zip" *)

rm -r "$tempDir"