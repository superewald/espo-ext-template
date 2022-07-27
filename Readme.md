EspoCRM extension template for easier development.

> It is recommended to use it with [espo-docker-dev] which supplies containerized espocrm environment.
>
> See [setup extensions]() in [espo-docker-dev] for more information.

## initialize

To intialize the extension do the following steps:

1. clone the template: `git clone https://github.com/superewald/espo-ext-template your-extension`
1. initialize the template: `cd your-extension && ./init.sh`

## build

1. `composer install`
1. `npm install`
1. `./build.sh` 

The script will generate a zip file in the root directory ready to be deployed.

[espo-docker-dev]: https://github.com/superewald/espo-docker-dev
[setup extensions]: https://github.com/superewald/espo-docker-dev#setup-extensions

## template structure

This template uses a cleaned up directory structure compared to the official espocrm extension template. Instead of alot of nested folders the template uses the following directory mapping:

| template | original | description|
|---|---|---|
| `app/` | `files/application/Espo/Modules/<ModuleName>` | application files (php and json) |
| `client/` | `files/client/modules/<module-name>` | client files (JS/CSS/LESS/HTML) |
| `scripts/` | `scripts/` | extension hooks (for (un)install)|

The build script creates the needed directory structure for the extension zip file. 