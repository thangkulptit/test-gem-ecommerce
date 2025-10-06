<template>
  <div
      ref="triggerRef"
      class="relative inline-flex"
      @mouseenter="startTracking"
      @mouseleave="stopTracking"
  >
    <slot />
    <Teleport to="body">
      <transition name="popover">
        <div
            v-if="visible"
            class="absolute z-50"
            :style="tooltipStyle"
        >
          <div
              ref="tooltipRef"
              :class="[
                'relative bg-[#212121] text-[#f9f9f9] text-sm font-normal px-2 py-1 rounded shadow-md whitespace-nowrap',
              ]"
          >
            {{ text }}
            <div
                :class="[
                  'absolute w-2 h-2 bg-[#212121] rotate-45',
                  arrowClass,
                ]"
            ></div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  position: {
    type: String,
    default: 'top', // top | bottom | left | right
    validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val),
  },
  canVisible: { type: Boolean, default: true },
  delay: { type: Number, default: 100 },
})

const visible = ref(false)
const timeoutId = ref(null)
const triggerRef = ref(null)
const tooltipRef = ref(null)
const effectivePosition = ref(props.position)

const tooltipStyle = computed(() => {
  if (!triggerRef.value) return {}

  const offset = 8
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value?.getBoundingClientRect() || { width: 0, height: 0 }

  let top = 0
  let left = 0
  let style = {}
  effectivePosition.value = props.position

  switch (props.position) {
    case 'bottom':
      top = triggerRect.bottom + offset
      left = triggerRect.left + triggerRect.width / 2
      style.transform = 'translateX(-50%)'
      if (top + tooltipRect.height > window.innerHeight) {
        effectivePosition.value = 'top'
        top = triggerRect.top - offset - tooltipRect.height
        style.transform = 'translateX(-50%) translateY(-100%)'
      }
      break
    case 'left':
      top = triggerRect.top + triggerRect.height / 2
      left = triggerRect.left - offset
      style.transform = 'translateX(-100%) translateY(-50%)'
      if (left - tooltipRect.width < 0) {
        effectivePosition.value = 'right'
        left = triggerRect.right + offset
        style.transform = 'translateY(-50%)'
      }
      break
    case 'right':
      top = triggerRect.top + triggerRect.height / 2
      left = triggerRect.right + offset
      style.transform = 'translateY(-50%)'
      if (left + tooltipRect.width > window.innerWidth) {
        effectivePosition.value = 'left'
        left = triggerRect.left - offset - tooltipRect.width
        style.transform = 'translateX(-100%) translateY(-50%)'
      }
      break
    case 'top':
    default:
      top = triggerRect.top - offset
      left = triggerRect.left + triggerRect.width / 2
      style.transform = 'translateX(-50%) translateY(-100%)'
      if (top - tooltipRect.height < 0) {
        effectivePosition.value = 'bottom'
        top = triggerRect.bottom + offset
        style.transform = 'translateX(-50%)'
      }
  }

  if (left + tooltipRect.width / 2 > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width / 2 - 8
  } else if (left - tooltipRect.width / 2 < 0) {
    left = tooltipRect.width / 2 + 8
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: style.transform,
  }
})

const arrowClass = computed(() => {
  switch (effectivePosition.value) {
    case 'bottom':
      return '-top-1 left-1/2 -translate-x-1/2'
    case 'left':
      return 'top-1/2 -right-1 -translate-y-1/2'
    case 'right':
      return 'top-1/2 -left-1 -translate-y-1/2'
    case 'top':
    default:
      return '-bottom-1 left-1/2 -translate-x-1/2'
  }
})

const startTracking = () => {
  if (!props.canVisible) return
  timeoutId.value = setTimeout(() => {
    visible.value = true
  }, props.delay)
}

const stopTracking = () => {
  clearTimeout(timeoutId.value)
  visible.value = false
}

const handleResize = () => {
  if (visible.value && triggerRef.value) {
    visible.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.popover-enter-active,
.popover-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
