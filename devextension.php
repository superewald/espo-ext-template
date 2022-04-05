<?php

include 'bootstrap.php';

if(count($argv) <= 2) {
    print("Please specify upload path to extension.\n");
    return;
}

$cmd = strtolower($argv[1]);
$path = $argv[2];

$app = new \Espo\Core\Application();
$app->setupSystemUser();
$container = $app->getContainer();

function runInstallScript(string $name, string $path, Espo\Core\Application $app) {
    $scriptPath = $path."/".$name.".php";
    if($app->getContainer()->get('fileManager')->exists($scriptPath)) {
        include($scriptPath);
        $scriptCls = new $name();
        $scriptCls->run($app->getContainer());
    }
}


function installExtension(string $path, \Espo\Core\Application $app) {
    try  {
        $container = $app->getContainer();

        /** @var Espo\Core\Utils\File\Manager */
        $fm = $container->get('fileManager');
        /** @var Espo\ORM\EntityManager */
        $em = $container->get('entityManager');
    
        if(!$fm->isDir($path)) {
            print("Path does not exist or is not directory!\n");
            return;
        }
        
        $manifest = $fm->getContents($path."/manifest.json");
        if(!$manifest) {
            print("Manifest was not found!\n");
            return;
        }
        $manifest = json_decode($manifest, true);
        
        // before install
        runInstallScript("BeforeInstall", $path."/scripts/", $app);
    
        // check if extension was already installed before
        $ext = $em->getRepository('Extension')->where([
            'name=' => $manifest['name']
        ])->findOne();
        
        if($ext == null) {
            $ext = $em->createEntity('Extension', $manifest);
            $ext->set('isInstalled', true);
            $em->saveEntity($ext);
    
            runInstallScript("AfterInstall", $path."/scripts", $app);
    
            print("Extension {$manifest['name']} was installed.\n");
        } else {
            if(!$ext->get('isInstalled')) {
                $ext->set('isInstalled', true);
                $em->saveEntity($ext);
                print("Extension was activated.\n");
            }
    
            print("Extension {$manifest['name']} was already installed.\n");
        }
    } catch(Throwable $e) {
        print($e->getMessage());
        exit;
    }
}

function uninstallExtension(string $path, \Espo\Core\Application $app) {
    try  {
        $container = $app->getContainer();

        /** @var Espo\Core\Utils\File\Manager */
        $fm = $container->get('fileManager');
        /** @var Espo\ORM\EntityManager */
        $em = $container->get('entityManager');
    
        if(!$fm->isDir($path)) {
            print("Path does not exist or is not directory!");
            return;
        }
        
        $manifest = $fm->getContents($path."/manifest.json");
        if(!$manifest) {
            print("Manifest was not found!");
            return;
        }
        $manifest = json_decode($manifest, true);

        runInstallScript("BeforeUninstall", $path."/scripts/", $app);

        $exts = $em->getRepository('Extension')->where([
            'name' => $manifest['name']
        ])->find();

        foreach($exts as $ext) {
            $em->removeEntity($ext);
        }

        runInstallScript("AfterUninstall", $path."/scripts/", $app);
        print("Extension {$manifest['name']} was uninstalled.\n");
    } catch(Exception $e) {
        print($e->getMessage()."\n");
        return;
    }
}

switch($cmd) {
    case 'install':
    case 'i':
        installExtension($path, $app);
        break;
    case 'uninstall':
    case 'u':
        uninstallExtension($path, $app);
}