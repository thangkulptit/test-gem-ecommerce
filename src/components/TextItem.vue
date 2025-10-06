<template>
  <div class="flex justify-between">
    <label :for="label" class="font-normal text-xs w-1/2 text-[#AAAAAA] flex items-center">
        {{ label }}
    </label>

    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: ''
})
</script>