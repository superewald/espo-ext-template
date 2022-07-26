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