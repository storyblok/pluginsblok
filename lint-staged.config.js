/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "{packages,apps,tools}/**/*.{js,ts,jsx,tsx,json}": [
    (filenames) =>
      `pnpm exec nx affected -t=lint --files=${filenames.join(",")} -- --fix`,
  ],
};
