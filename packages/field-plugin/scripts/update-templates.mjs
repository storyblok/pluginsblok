#!/usr/bin/env zx
import { $, spinner } from 'zx'

await spinner('Updating the library version in all the templates...', () =>
  $`nx run @storyblok/field-plugin-cli:build`.quiet(),
)
