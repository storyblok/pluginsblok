import { vi } from 'vitest'
import { create } from '../'
import { createMonorepo } from '../monorepo'
import { createStandalone } from '../standalone'
import {
  exitIfInvalidNameOption,
  isValidPackageManager,
  selectPackageManager,
  selectRepositoryStructure,
  isValidStructure,
} from '../../../utils'

vi.mock('../../../utils')
vi.mock('../monorepo')
vi.mock('../standalone')

describe('create', () => {
  let utils: typeof import('../../../utils')

  beforeAll(async () => {
    utils = await vi.importActual('../../../utils')
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('asks for package manager if not given', async () => {
    vi.mocked(isValidPackageManager).mockImplementation(
      utils.isValidPackageManager,
    )
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'npmmmm' })
    expect(selectPackageManager).toHaveBeenCalledTimes(1)
  })

  it('does not ask for package manager if given', async () => {
    vi.mocked(isValidPackageManager).mockImplementation(
      utils.isValidPackageManager,
    )
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'yarn' })
    expect(selectPackageManager).toHaveBeenCalledTimes(0)
  })

  it('asks for structure if not given', async () => {
    vi.mocked(isValidStructure).mockImplementation(utils.isValidStructure)
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'npm', structure: 'i do not know' })
    expect(selectRepositoryStructure).toHaveBeenCalledTimes(1)
  })

  it('does not ask for structure if given', async () => {
    vi.mocked(isValidStructure).mockImplementation(utils.isValidStructure)
    // @ts-expect-error testing wrong arguments
    await create({ packageManager: 'npm', structure: 'standalone' })
    expect(selectRepositoryStructure).toHaveBeenCalledTimes(0)
  })

  it.each([
    { repoName: '../evil' },
    { pluginName: '../evil' },
    { pluginName: '@acme/plugin' },
  ])('exits before prompting or writing for %j', async (names) => {
    vi.mocked(exitIfInvalidNameOption).mockImplementation(
      utils.exitIfInvalidNameOption,
    )
    const exit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit')
    })
    await expect(
      // @ts-expect-error testing wrong arguments
      create({ dir: '.', structure: 'monorepo', ...names }),
    ).rejects.toThrow('process.exit')
    expect(exit).toHaveBeenCalledWith(1)
    expect(selectPackageManager).not.toHaveBeenCalled()
    expect(createMonorepo).not.toHaveBeenCalled()
    expect(createStandalone).not.toHaveBeenCalled()
  })
})
