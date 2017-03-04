/* ------------------------------------------
 * This module compiles the module's TypeScript files
 * Note: Test files are only compiled in memory
 * -------------------------------------------- */
import * as q from 'smartq'

import { INpmtsConfig } from '../npmts.config'

import * as plugins from './mod00.plugins'

import * as NpmtsAssets from './mod00.assets'
import * as NpmtsCheck from './mod00.check'
import * as NpmtsClean from './mod00.clean'
import * as NpmtsCompile from './mod00.compile'

export let run = function(configArg: INpmtsConfig): Promise<INpmtsConfig> {
    let done = q.defer<INpmtsConfig>()
    plugins.beautylog.ora.text('starting TypeScript Compilation')
    NpmtsClean.run(configArg)
        .then(NpmtsCheck.run)
        .then(NpmtsCompile.run)
        .then(NpmtsAssets.run)
        .then(function(){
            done.resolve(configArg)
        })
        return done.promise
}
