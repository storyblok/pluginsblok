<script lang="jsx">
import Checkmark from '@/components/Checkmark.vue'
import { contrastRatio, hexToSRGB, relativeLuminance } from '@/utils'

const white = '#FFFFFF'
const ink = '#1b243f'
const divider = '#DFE3E8'
const transparent = 'transparent'

const contrastThresholdBorder = 17
const contrastThresholdText = 11

const blackSRGB = { r: 0, g: 0, b: 0 }

const hexColorContrast = (hexColor) =>
  contrastRatio(
    relativeLuminance(hexToSRGB(hexColor) ?? blackSRGB),
    relativeLuminance(blackSRGB),
  )

const contrastTextColor = (hexColor) => {
  return hexColorContrast(hexColor) > contrastThresholdText ? ink : white
}
const contrastBorderColor = (hexColor) => {
  return hexColorContrast(hexColor) > contrastThresholdBorder
    ? divider
    : transparent
}

export default {
  name: 'Swatch',
  props: {
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'medium',
      validator(value) {
        return ['small', 'medium', 'large'].includes(value)
      },
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    setValue: {
      type: Function,
      default: () => undefined,
    },
  },
  render() {
    const { size, color, selected, setValue } = this
    return (
      <div
        class={`plugin-swatch plugin-swatch--${size} ${
          selected ? 'plugin-swatch--selected' : ''
        }`}
      >
        <div
          class="plugin-swatch__button"
          style={{
            backgroundColor: color,
            color: contrastTextColor(this.color),
            borderColor: contrastBorderColor(this.color),
          }}
          onClick={() =>
            this.selected ? setValue(undefined) : setValue(color)
          }
        >
          {selected && <Checkmark class="plugin-swatch__checkmark" />}
        </div>
      </div>
    )
  },
}
</script>

<style scoped>
.plugin-swatch {
  padding: 10px;
}

.plugin-swatch--small {
  border-radius: 5px;
  padding: 15px;
}

.plugin-swatch--small .plugin-swatch__button {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.plugin-swatch--small:not(.plugin-swatch--selected) {
  border: 1px solid transparent;
}

.plugin-swatch--small.plugin-swatch--selected {
  border: 1px solid #00b3b0;
}

.plugin-swatch--medium {
  border-radius: 5px;
  padding: 5px;
}

.plugin-swatch--medium .plugin-swatch__button {
  width: 36px;
  height: 36px;
  border-radius: 5px;
}

.plugin-swatch--large {
  border-radius: 0px;
  padding: 0px;
  width: 100%;
}

.plugin-swatch--large .plugin-swatch__button {
  height: 20px;
  width: 100%;
  border-radius: 0px;
}

.plugin-swatch__button {
  color: #ffffff;
  border: 1px solid transparent;
  height: 10px;
  width: 10px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
}

.plugin-swatch__checkmark {
  height: 20px;
}
</style>
