<script setup>
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'
import Plugin from './Plugin.vue'

const initialContent = () => ({
  image: '',
  plugin: 'sbi-annotated-image',
  mapNodes: [],
})

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const plugin = useFieldPlugin({
  // Fill in missing or invalid keys, so content saved without them still works
  validateContent: (content) => {
    const value = isObject(content) ? content : {}
    return {
      content: {
        ...initialContent(),
        ...value,
        image: typeof value.image === 'string' ? value.image : '',
        mapNodes: Array.isArray(value.mapNodes) ? value.mapNodes : [],
      },
    }
  },
})
</script>

<template>
  <Plugin
    v-if="plugin.type === 'loaded'"
    :plugin="plugin"
  />
</template>
