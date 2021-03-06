import * as q from 'smartq';

import * as plugins from './npmts.plugins';
import * as paths from './npmts.paths';
import * as NpmtsConfig from './npmts.config';
import * as NpmtsMods from './npmts.mods';
import * as NpmtsWatch from './npmts.watch';
import * as NpmtsShip from './npmts.ship';

/**
 * smartanalytics
 * this data is fully anonymized (no Ips or any other personal information is tracked).
 * It just keeps track which of our tools are really used...
 * ... so we know where to spend our limited resources for improving them.
 * Since yarn is out and there is heavy caching going on,
 * pure download stats are just not reliable enough for us anymore
 * Feel free to dig into the smartanalytics package, if you are interested in how it works.
 * It is just an https call to our own Lossless Analytics API.
 * Our privacy policy can be found here: https://lossless.gmbh/privacy.html
 */
let npmtsAnalytics = new plugins.smartanalytics.Analytics({
  apiEndPoint: 'https://pubapi.lossless.one/analytics',
  projectId: 'gitzone',
  appName: 'npmts'
});

process.nextTick(async () => {
  // make the analytics call
  npmtsAnalytics
    .recordEvent('npmToolExecution', {
      executionMode: (await NpmtsConfig.configPromise).mode,
      tsOptions: (await NpmtsConfig.configPromise).tsOptions,
      watch: (await NpmtsConfig.configPromise).watch,
      coverageTreshold: (await NpmtsConfig.configPromise).coverageTreshold
    })
    .catch(err => {
      plugins.beautylog.warn('Lossless Analytics API not available...');
    });
});

export let run = async () => {
  let done = q.defer();

  plugins.beautylog.figletSync('NPMTS');
  let npmtsProjectInfo = new plugins.projectinfo.ProjectinfoNpm(paths.npmtsPackageRoot);
  // check for updates
  await plugins.smartupdate.standardHandler.check(
    'npmts',
    npmtsProjectInfo.version,
    'http://gitzone.gitlab.io/npmts/changelog.html'
  );
  plugins.beautylog.log('---------------------------------------------');
  let npmtsCli = new plugins.smartcli.Smartcli();

  // build
  npmtsCli.addCommand('build').subscribe(
    async argvArg => {
      let done = q.defer();
      plugins.beautylog.info('npmts version: ' + npmtsProjectInfo.version);
      const configArg: NpmtsConfig.INpmtsConfig = await NpmtsConfig.run(argvArg);

      plugins.beautylog.ora.start('loading additional modules...');
      NpmtsMods.modCompile
        .load()
        .then(modCompile => {
          return modCompile.run(configArg);
        })
        .then(configArg => {
          let done = q.defer<NpmtsConfig.INpmtsConfig>();
          NpmtsMods.modDocs
            .load()
            .then(modDocs => {
              return modDocs.run(configArg);
            })
            .then(configArg => {
              done.resolve(configArg);
            });
          return done.promise;
        })
        .then(configArg => {
          let done = q.defer<NpmtsConfig.INpmtsConfig>();
          NpmtsMods.modTest
            .load()
            .then(modTest => {
              return modTest.run(configArg);
            })
            .then(configArg => {
              done.resolve(configArg);
            });
          return done.promise;
        })
        .then(NpmtsWatch.run)
        .then(NpmtsShip.run);

      return done.promise;
    },
    err => {
      if (err instanceof Error) {
        console.log(err);
      }
    }
  );

  // standard task
  npmtsCli.standardTask().subscribe(async argvArg => {
    await npmtsCli.trigger('build');
  });

  // cli metadata
  npmtsCli.addVersion(npmtsProjectInfo.version);

  // start parsing
  npmtsCli.startParse();
  return await done.promise;
};
