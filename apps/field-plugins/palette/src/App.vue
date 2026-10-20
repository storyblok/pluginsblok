<script setup>
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'
import PalettePlugin from './components/PalettePlugin.vue'

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const plugin = useFieldPlugin({
  // Fill in missing or invalid keys, so content saved without them still works
  validateContent: (content) => {
    const value = isObject(content) ? content : {}
    return {
      content: {
        plugin: 'storyblok-palette',
        ...value,
        value: typeof value.value === 'string' ? value.value : undefined,
      },
    }
  },
})
</script>

<template>
  <PalettePlugin
    v-if="plugin.type === 'loaded'"
    :plugin="plugin"
  />
</template>

<style>
body {
  margin: 0;
}
</style>
