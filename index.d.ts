/// <reference path="../ts/typings/main.d.ts" />
declare module NpmtsPlugins {
    var init: () => {
        beautylog: any;
        fs: any;
        gulp: any;
        g: {
            coveralls: any;
            header: any;
            istanbul: any;
            mocha: any;
            sourcemaps: any;
            typescript: any;
        };
        mergeStream: any;
        sourceMapSupport: any;
        path: any;
        q: any;
        smartcli: any;
        smartfile: any;
        typings: any;
    };
}
declare module NpmtsPaths {
    var init: () => any;
}
declare module NpmtsConfigFile {
    var run: () => any;
}
declare module NpmtsOptions {
    var run: (configArg: any) => any;
}
declare module NpmtsCompile {
    var run: (configArg: any) => any;
}
declare module NpmtsTests {
    var run: (configArg: any) => any;
}
declare module NpmtsPromisechain {
    var init: () => any;
}
declare var plugins: {
    beautylog: any;
    fs: any;
    gulp: any;
    g: {
        coveralls: any;
        header: any;
        istanbul: any;
        mocha: any;
        sourcemaps: any;
        typescript: any;
    };
    mergeStream: any;
    sourceMapSupport: any;
    path: any;
    q: any;
    smartcli: any;
    smartfile: any;
    typings: any;
};
declare var paths: any;
declare var promisechain: any;
