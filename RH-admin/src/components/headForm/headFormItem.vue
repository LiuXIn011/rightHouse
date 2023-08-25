<template>
  <a-col
    :xs="xs"
    :sm="sm"
    :md="md"
    :lg="lg"
    :xl="xl"
    :span="span"
    :offset="offset"
    :class="{ 'button-box': type === 'button' }"
  >
    <div ref="slotdom" class="lable-box">
      <p
        v-if="label !== null && label !== undefined && label !== ''"
        :style="`width:${currentLabelWidth()}px;text-align:${labelAlign};`"
      >
        {{ label }}
      </p>
      <slot>
        <a-button v-if="type === 'button'" type="primary" @click="search">
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>
      </slot>
    </div>
  </a-col>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  toRaw
} from 'vue';

const emits = defineEmits(['search'])
defineProps({
  labelWidth: {
    type: [Number, String]
  },
  labelAlign: {
    type: String,
    default: 'right'
  },
  type: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  span: {
    type: Number,
    default: 24
  },
  offset: {
    type: Number,
    default: 0
  },
  pull: {
    type: Number,
    default: 0
  },
  xs: {
    type: [Number, Object],
    default: 24
  },
  sm: {
    type: [Number, Object],
    default: 12
  },
  md: {
    type: [Number, Object],
    default: 12
  },
  lg: {
    type: [Number, Object],
    default: 8
  },
  xl: {
    type: [Number, Object],
    default: 6
  }
});
const HeadForm = () => {
  const that = getCurrentInstance();
  let parent: any = that?.parent?.proxy?.$;
  let parentName = toRaw(parent?.setupState?.componentName);
  while (parent && parentName !== 'HeadForm') {
    parent = parent?.parent;
    parentName = toRaw(parent?.setupState?.componentName);
  }
  return parent?.props.labelWidth;
};
const currentLabelWidth = () => {
  return HeadForm() || 100;
};
const search = () => {
  emits('search')
}
</script>

<style lang="scss" scoped>
.lable-box {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 100%;
  margin-bottom: 10px;

  p {
    margin: 0;
    margin-right: 10px;
    font-size: 14px;
    flex-shrink: 0;
    color: rgb(var(--gray-10));
  }
}
</style>

<style lang="scss">
.button-box {
  flex-grow: 1 !important;
  display: flex;
  justify-content: flex-end;
}
</style>
