<template>
  <a-row :gutter="gutter" style="width: 100%;">
    <slot />
  </a-row>
</template>

<script setup lang="ts">
import {
  ref
} from 'vue'

defineProps({
  labelWidth: {
    type: [Number, String],
    default: 80
  },
  gutter: {
    type: [Number],
    default: 0
  }
})
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const componentName = ref('HeadForm')
</script>

<style>

</style>
