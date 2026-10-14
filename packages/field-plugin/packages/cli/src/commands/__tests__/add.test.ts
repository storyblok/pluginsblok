import { existsSync } from 'fs'
import { readdir, readFile } from 'fs/promises'
import tempDir from 'temp-dir'
import { add, PackageJson } from '../add'
import { randomString, selectPackageManager } from '../../utils'
import { vi } from 'vitest'

vi.mock('../../utils', async () => {
  const actualUtils =
    await vi.importActual<typeof import('../../utils')>('../../utils')

  return {
    ...actualUtils,
    runCommand: vi.fn(() => ({ stdout: '' })),
    selectPackageManager: vi.fn(),
  }
})

describe('add', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds a standalone template', async () => {
    const folderName = randomString()
    const name = randomString()
    const dir = `${tempDir}/${folderName}`
    await add({
      dir,
      packageManager: 'npm',
      name,
      template: 'react',
      structure: 'standalone',
    })
    const files = await readdir(`${dir}/${name}`)
    expect(files).toContain('.env.local.example')

    const packageJson = JSON.parse(
      (await readFile(`${dir}/${name}/package.json`)).toString(),
    ) as PackageJson
    expect(packageJson['scripts']['deploy']).toMatchInlineSnapshot(
      '"npm run build && npx @storyblok/field-plugin-cli@latest deploy"',
    )
    expect(files).toMatchInlineSnapshot(`
      [
        ".env.local.example",
        ".gitignore",
        ".nvmrc",
        ".prettierrc",
        "README.md",
        "eslint.config.js",
        "field-plugin.config.json",
        "index.html",
        "package.json",
        "src",
        "tsconfig.json",
        "tsconfig.node.json",
        "vite.config.ts",
      ]
    `)
  })

  it('adds a monorepo template', async () => {
    const folderName = randomString()
    const name = randomString()
    const dir = `${tempDir}/${folderName}`
    await add({
      dir,
      packageManager: 'npm',
      name,
      template: 'react',
      structure: 'monorepo',
    })
    const files = await readdir(`${dir}/${name}`)

    expect(files).not.toContain('.env.local.example')

    const packageJson = JSON.parse(
      (await readFile(`${dir}/${name}/package.json`)).toString(),
    ) as PackageJson
    expect(packageJson['scripts']['deploy']).toMatchInlineSnapshot(
      '"npm run build && npx @storyblok/field-plugin-cli@latest deploy --dotEnvPath \'../../.env\'"',
    )
    expect(files).toMatchInlineSnapshot(`
      [
        ".gitignore",
        ".nvmrc",
        ".prettierrc",
        "README.md",
        "eslint.config.js",
        "field-plugin.config.json",
        "index.html",
        "package.json",
        "src",
        "tsconfig.json",
        "tsconfig.node.json",
        "vite.config.ts",
      ]
    `)
  })

  it('rejects a package name that would escape the target directory', async () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit')
    })
    const dir = `${tempDir}/${randomString()}`
    await expect(
      add({
        dir,
        // @ts-expect-error unset, to check the name fails before any prompt
        packageManager: undefined,
        name: '../evil',
        template: 'react',
        structure: 'standalone',
      }),
    ).rejects.toThrow('process.exit')
    expect(exit).toHaveBeenCalledWith(1)
    expect(selectPackageManager).not.toHaveBeenCalled()
    expect(existsSync(`${tempDir}/evil`)).toBe(false)
  })
})
