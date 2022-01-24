process.env.NODE_ENV = 'development'

import { spawn } from 'child_process'
import electron from 'electron'
import { createRequire } from 'module'
import { build as viteBuild, createServer } from 'vite'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

/**
 * @param {{ name: string; configFile: string; writeBundle: import('rollup').OutputPlugin['writeBundle'] }} param0
 * @returns {import('rollup').RollupWatcher}
 */
function getWatcher({ name, configFile, writeBundle }) {
  return viteBuild({
    // Options here precedence over configFile
    mode: process.env.NODE_ENV,
    build: {
      watch: {},
    },
    configFile,
    plugins: [{ name, writeBundle }],
  })
}

/**
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchMain() {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null

  /**
   * @type {import('rollup').RollupWatcher}
   */
  const watcher = await getWatcher({
    name: 'electron-main-watcher',
    configFile: 'configs/vite.main.js',
    writeBundle() {
      electronProcess && electronProcess.kill()
      electronProcess = spawn(electron, ['.'], {
        stdio: 'inherit',
        env: Object.assign(process.env, pkg.env),
      })
    },
  })

  return watcher
}

/**
 * @param {import('vite').ViteDevServer} viteDevServer
 * @returns {Promise<import('rollup').RollupWatcher>}
 */
async function watchPreload(viteDevServer) {
  return getWatcher({
    name: 'electron-preload-watcher',
    configFile: 'configs/vite.preload.js',
    writeBundle() {
      viteDevServer.ws.send({
        type: 'full-reload',
      })
    },
  })
}

// bootstrap
const viteDevServer = await createServer({
  configFile: 'configs/vite.renderer.js',
})

await viteDevServer.listen()
await watchPreload(viteDevServer)
await watchMain()
