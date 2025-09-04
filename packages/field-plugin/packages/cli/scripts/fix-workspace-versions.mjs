import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliRoot = path.resolve(__dirname, '..') // → .../field-plugin/packages/cli
const repoRoot = path.resolve(cliRoot, '../../../..') // go 4 levels up → repo root
const distTemplatesDir = path.join(cliRoot, 'dist/templates')

const packageVersions = {}

/**
 * Collect { packageName: version } for every workspace package
 */
function collectPackages(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    const stat = fs.lstatSync(full)
    if (stat.isDirectory()) {
      collectPackages(full)
    } else if (entry === 'package.json') {
      const pkg = JSON.parse(fs.readFileSync(full, 'utf-8'))
      if (pkg.name && pkg.version) {
        packageVersions[pkg.name] = pkg.version
      }
    }
  }
}

// Explicitly collect packages from root "packages"
collectPackages(path.join(repoRoot, 'packages'))

/**
 * Walk dist/templates and replace workspace:* with actual versions
 */
function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    const stat = fs.lstatSync(full)
    if (stat.isDirectory()) {
      walk(full)
    } else if (entry === 'package.json') {
      const pkg = JSON.parse(fs.readFileSync(full, 'utf-8'))
      let changed = false
      for (const sec of [
        'dependencies',
        'devDependencies',
        'peerDependencies',
      ]) {
        if (pkg[sec]) {
          for (const dep of Object.keys(pkg[sec])) {
            const spec = pkg[sec][dep]
            if (typeof spec === 'string' && spec.startsWith('workspace:')) {
              if (packageVersions[dep]) {
                const prefix = spec.replace('workspace:', '')
                const actual = packageVersions[dep]
                pkg[sec][dep] =
                  prefix && ['^', '~'].includes(prefix)
                    ? `${prefix}${actual}`
                    : actual
                changed = true
              }
            }
          }
        }
      }
      if (changed) {
        fs.writeFileSync(full, JSON.stringify(pkg, null, 2))
        console.log(`🔧 Fixed versions in ${full}`)
      }
    }
  }
}

if (fs.existsSync(distTemplatesDir)) {
  walk(distTemplatesDir)
  console.log('✅ workspace:* replaced with actual versions in dist/templates')
} else {
  console.warn('⚠️ dist/templates does not exist yet. Did you run the build?')
}
