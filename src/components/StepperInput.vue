<template>
  <div
      class="inline-flex rounded-lg overflow-hidden bg-[#212121] border"
      :class="isFocused ? ' border-[#3C67FF]' : 'border-[#212121]'"
  >
    <Tooltip :can-visible="overMinValue" text="Value must greater than 0" position="top">
      <button
          tabindex="-1"
          class="w-[36px] h-[36px] flex items-center justify-center text-[#f9f9f9] "
          :disabled="overMinValue"
          :class="[
        overMinValue ? 'cursor-not-allowed disabled:bg-[#212121] disabled:color-[#AAAAAA]' : 'hover:bg-[#3B3B3B] cursor-pointer',
        isHoverInput ? 'bg-[#3B3B3B]': 'bg-[#212121]'
      ]"
          @click="decrement"
      >
        <MinusDisableIcon v-if="overMinValue" />
        <MinusIcon v-else />
      </button>
    </Tooltip>

    <input
        v-model="displayValue"
        @focus="onFocus"
        @blur="onBlur"
        @mouseenter="hoverInput"
        @mouseleave="outHoverInput"
        @input="onInput"
        type="text"
        inputmode="decimal"
        class="text-center outline-none py-2  w-[68px]"
        :class="
          [
              isHoverInput ? 'bg-[#3B3B3B]' : 'bg-[#212121]'
          ]
        "
    />

    <Tooltip :can-visible="overMaxValue" text="Value must smaller than 100" position="top">
      <button
          tabindex="-1"
          class="w-[36px] h-[36px] flex items-center justify-center color-[#f9f9f9] "
          :disabled="overMaxValue"
          :class="[
        overMaxValue ? 'cursor-not-allowed disabled:bg-[#212121] disabled:color-[#AAAAAA]' : 'hover:bg-[#3B3B3B]  cursor-pointer',
        isHoverInput ? 'bg-[#3B3B3B]': 'bg-[#212121]'
      ]"
          @click="increment"
      >
        <PlusDisableIcon v-if="overMaxValue" />
        <PlusIcon v-else />
      </button>
    </Tooltip>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue'
import MinusIcon from '../assets/icons/minus.svg';
import PlusIcon from '../assets/icons/plus.svg';
import Tooltip from "./Tooltip.vue";

import MinusDisableIcon from '../assets/icons/minus-disabled.svg';
import PlusDisableIcon from '../assets/icons/plus-disabled.svg';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  step: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    default: 'px', // 'px' | '%'
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(Number(props.modelValue) || 0)
const displayValue = ref(String(internalValue.value))
const isFocused = ref(false)
const hasValidValue = ref(Number(props.modelValue) > 0)
const isHoverInput = ref(false);

const minValue = 0
const maxValue = computed(() => (props.unit === '%' ? 100 : Infinity))
const overMaxValue = computed(() => internalValue.value >= maxValue.value)
const overMinValue = computed(() => Number(internalValue.value) <= minValue)

watch(
    () => props.modelValue,
    (val) => {
      const numVal = Number(val) || 0
      if (numVal > 0) {
        hasValidValue.value = true
      }
      internalValue.value = numVal
      if (!isFocused.value) {
        displayValue.value = String(internalValue.value)
      }
    }
)

watch(
    () => props.unit,
    (newUnit) => {
      if (newUnit === '%' && internalValue.value > 100) {
        internalValue.value = 100
        displayValue.value = '100'
        emit('update:modelValue', 100)
        emit('change', 100)
      }
    }
)

const parseInputValue = (val) => {
  if (!val || val === '') return null

  val = val.replace(/,/g, '.')

  let cleaned = ''
  let hasDecimal = false
  let startedWithNumber = false

  if (val[0] === '-') {
    return '0'
  }

  for (let i = 0; i < val.length; i++) {
    const char = val[i]

    if (char >= '0' && char <= '9') {
      cleaned += char
      startedWithNumber = true
    } else if (char === '.' && !hasDecimal && cleaned !== '') {
      cleaned += char
      hasDecimal = true
    } else if (char === '.' && (hasDecimal || cleaned === '')) {
      return null
    } else if (!startedWithNumber) {
      return null
    } else {
      break
    }
  }

  if (cleaned === '' || cleaned === '.') return null

  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

const onFocus = () => {
  isFocused.value = true
  displayValue.value = String(parseFloat(internalValue.value))
}

const onInput = (e) => {
  displayValue.value = e.target.value
}

const onBlur = () => {
  isFocused.value = false
  let num = parseInputValue(displayValue.value)

  if (num === null) {
    if (hasValidValue.value) {
      displayValue.value = String(internalValue.value)
    } else {
      displayValue.value = ''
      internalValue.value = 0
    }
    return
  }

  if (num < 0) {
    num = 0
  }

  if (props.unit === '%' && num > 100) {
    if (hasValidValue.value) {
      displayValue.value = String(internalValue.value)
    } else {
      displayValue.value = ''
      internalValue.value = 0
    }
    return
  }

  hasValidValue.value = true
  internalValue.value = num
  displayValue.value = String(num)
  emit('update:modelValue', num)
  emit('change', num)
}

const hoverInput = () => {
  isHoverInput.value = true
}

const outHoverInput = () => {
  isHoverInput.value = false
}

const roundNumber = (num, decimals = 6) => {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

const decrement = () => {
  if (internalValue.value <= minValue) return
  let newVal = internalValue.value - props.step
  newVal = roundNumber(Math.max(newVal, minValue))
  hasValidValue.value = true
  internalValue.value = newVal
  displayValue.value = String(newVal)
  emit('update:modelValue', newVal)
  emit('change', newVal)
}

const increment = () => {
  if (internalValue.value >= maxValue.value) return
  let newVal = internalValue.value + props.step
  newVal = roundNumber(Math.min(newVal, maxValue.value))
  hasValidValue.value = true
  internalValue.value = newVal
  displayValue.value = String(newVal)
  emit('update:modelValue', newVal)
  emit('change', newVal)
}
</script>
