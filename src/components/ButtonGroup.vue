<template>
  <div class="inline-flex rounded-lg overflow-hidden bg-[#212121] p-[2px]">
    <button
        v-for="(btn, index) in buttons"
        :key="index"
        :class="[
        'rounded-md font-medium px-[28px] py-[8px] cursor-pointer text-xs',
        activeValue === btn[valueText]
          ? 'text-[#F9F9F9] bg-[#424242]'
          : 'text-[#AAAAAA] ',
        index === 0 ? 'rounded-l-lg' : '',
        index === buttons.length - 1 ? 'rounded-r-lg' : '',
      ]"
        @click="handleClick(btn[valueText])"
    >
      {{ btn[labelText] }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'

const props = defineProps({
  buttons: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, null],
    default: null,
  },
  labelText: { // Tên key trong cái array buttons để hiển thị ra Label
    type: String,
    default: 'label'
  },
  valueText: { // Tên key trong cái array buttons để ra value emit ra
    type: String,
    default: 'value'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const activeValue = ref(props.modelValue)

watch(
    () => props.modelValue,
    (val) => {
      activeValue.value = val
    }
)

const handleClick = (value) => {
  activeValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>