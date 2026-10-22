<script lang="jsx">
import Palette from '@/components/Palette.vue'

// Options that are not set can come in as an empty string
const optionOrUndefined = (value) => (value === '' ? undefined : value)

export default {
  props: {
    plugin: {
      type: Object,
      required: true,
    },
  },
  computed: {
    options() {
      return this.plugin.data.options
    },
    value() {
      return this.plugin.data.content
    },
  },
  mounted() {
    const defaultValue = optionOrUndefined(this.options.defaultValue)
    if (!this.value?.value) {
      this.setValue({ value: defaultValue })
    }
  },
  methods: {
    setValue(value) {
      this.plugin.actions.setContent({ ...this.value, ...value })
    },
  },
  render() {
    const defaultValue = optionOrUndefined(this.options.defaultValue)
    const colorsOption = optionOrUndefined(this.options.colors)
    const colors =
      typeof colorsOption === 'undefined' ? undefined : JSON.parse(colorsOption)
    return (
      <Palette
        setValue={(value) => this.setValue({ value })}
        value={this.value?.value ?? defaultValue}
        size={optionOrUndefined(this.options.size)}
        colors={colors}
      />
    )
  },
}
</script>
