/// <reference path="./index.ts" />
module NpmtsPaths {
    export var init = function() {
        var paths:any = {};
        paths.cwd = plugins.smartcli.get.cwd().path;
        paths.tsDir = plugins.path.join(paths.cwd,"ts/");
        paths.indexTS = plugins.path.join(paths.cwd,"ts/index.ts");
        paths.testTS = plugins.path.join(paths.cwd,"ts/test.ts");
        paths.testDir = plugins.path.join(paths.cwd,"test/");
        return paths;
    }
}