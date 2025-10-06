<template>
  <div
      className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100"
  >
    <div className="bg-neutral-800 p-4 rounded-lg w-4xl h-80">
      <div className="bg-neutral-950 w-[280px] p-[16px]">
        <TextItem label="Unit">
          <ButtonGroup class="w-[140px]" :buttons="buttonDatas" v-model="form.unit" />
        </TextItem>
        <TextItem class="mt-[16px]" label="Value">
          <StepperInput v-model="form.value" :unit="form.unit" />
        </TextItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StepperInput from './components/StepperInput.vue';
import TextItem from "./components/TextItem.vue";
import ButtonGroup from "./components/ButtonGroup.vue";
import { reactive } from "vue"

enum Unit {
  Pixel = 'px',
  Percent = '%',
}

const buttonDatas = [
  { label: '%', value: Unit.Percent },
  { label: 'px', value: Unit.Pixel}
]

const form = reactive({
  unit: Unit.Pixel,
  value: '50'
})

</script>
