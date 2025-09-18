const fs = require('fs')
const path = require('path')
const url = require('url')
const markdownMagic = require('markdown-magic') // eslint-disable-line
const globby = require('markdown-magic').globby // eslint-disable-line

const toTitleCase = (str) => {
  // eslint-disable-line
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  )
}

const formatPluginName = (string) => {
  // eslint-disable-line
  return toTitleCase(string.replace(/-/g, ' '))
}

const username = (repo) => {
  if (!repo) {
    return null
  }

  const o = url.parse(repo)
  var urlPath = o.path // eslint-disable-line

  if (urlPath.length && urlPath.charAt(0) === '/') {
    urlPath = urlPath.slice(1)
  }

  urlPath = urlPath.split('/')[0]
  return urlPath
}

const config = {
  transforms: {
    /*
    In README.md the below function will add a list from Readme files in the folders
     */
    EXAMPLE_TABLE() {
      const globBase = path.resolve(__dirname, './*/README.md')
      const examples = globby.sync([
        globBase,
        '!README.md',
        '!**/node_modules/**/README.md',
        '!**/bin/**/netcoreapp2.1/**/README.md',
      ])
      let md = '| Example  | Author |\n'
      md += '|:-------|:------:|\n'
      const rows = []
      examples.forEach((example) => {
        const data = fs.readFileSync(example, 'utf8')
        const readme = data.split(/\r?\n/)
        // Find the header line, ignoring leading/trailing pipes and whitespace
        const tableHeaderIdx = readme.findIndex((line) => {
          const clean = line
            .replace(/^\s*\|?|\|?\s*$/g, '')
            .trim()
            .toLowerCase()
          return (
            clean.startsWith('name') &&
            clean.includes('description') &&
            clean.includes('author')
          )
        })
        if (tableHeaderIdx === -1) {
          console.log(`[SKIP] No table header found in: ${example}`)
          return
        }
        // Find the first valid data row after the header and separator
        let rowIdx = tableHeaderIdx + 1
        while (rowIdx < readme.length) {
          const line = readme[rowIdx].replace(/^\s*\|?|\|?\s*$/g, '').trim()
          if (line === '' || /^[-\s|:]+$/.test(line)) {
            rowIdx++
            continue
          }
          break
        }
        // Now rowIdx should be at the first data row
        let row = readme[rowIdx]
        if (!row || (row.match(/\|/g) || []).length < 2) {
          console.log(`[SKIP] No valid data row in: ${example}`)
          return
        }
        // Remove leading/trailing pipes and whitespace, then split
        row = row.trim().replace(/^\|/, '').replace(/\|$/, '')
        const cols = row.split('|').map((s) => s.trim())
        if (cols.length < 3 || !cols[0]) {
          console.log(`[SKIP] Data row does not have 3 columns in: ${example}`)
          return
        }
        const [name, description, author] = cols
        const dirname = path.dirname(example)
        const exampleUrl = `https://github.com/storyblok/pluginsblok/tree/main/apps/field-plugins/${path.basename(
          dirname,
        )}`
        rows.push({
          name: name,
          displayName: formatPluginName(name),
          url: exampleUrl,
          description,
          author,
        })
      })
      // Sort rows alphabetically by displayName
      rows.sort((a, b) => a.displayName.localeCompare(b.displayName))
      rows.forEach((row) => {
        md += `| **[${row.displayName}](${row.url})** <br/> ${row.description} | ${row.author} |\n`
      })
      return md
    },

    /*
    In README.md the below function will add a list from the community-examples.json file
    */

    COMMUNITY_EXAMPLES_TABLE() {
      const exampleFile = path.join(__dirname, 'community-examples.json')
      const examples = JSON.parse(fs.readFileSync(exampleFile, 'utf8'))
      // Make table header
      let md = '| Example | Author |\n'
      md += '|:-------|:------:|\n'
      // Sort alphabetically
      examples
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .forEach((data) => {
          // eslint-disable-line
          // add table rows
          const userName = username(data.githubUrl)
          const profileURL = `http://github.com/${userName}`
          md += `| **[${formatPluginName(data.name)}](${
            data.githubUrl
          })** <br/>`
          md += ` ${data.description} | [${userName}](${profileURL}) |\n`
        })
      return md.replace(/^\s+|\s+$/g, '')
    },
  },
}

const markdownPath = path.join(__dirname, 'README.md')

markdownMagic(markdownPath, config, () => {
  console.log('Docs updated!') // eslint-disable-line
})
