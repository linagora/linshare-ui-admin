<template>
  <a-button class="ls-button" v-bind="$attrs" :class="classByColorProp">
    <!-- <slot v-for="slot in Object.keys($slots)" :name="slot" /> -->
    <slot></slot>
  </a-button>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  color?: 'default' | 'success' | 'error' | 'warning' | 'info';
}
const props = withDefaults(defineProps<Props>(), {
  color: 'default',
});

const classByColorProp = computed(() => {
  return `ls-button--${props.color}`;
});
</script>
<style lang="less">
@import '@/core/styles/main.less';

.ls-button {
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 24px;
  height: 48px;
  padding: 12px 24px;
  &--info {
    color: @link-color;
  }

  &--success {
    color: @success-color;
  }

  &--warning {
    color: @warning-color;
  }

  &--error {
    color: @error-color;
  }

  &--info.ant-btn-primary {
    background-color: @link-color;
    color: #fff;
  }

  &--success.ant-btn-primary {
    background-color: @success-color;
    color: #fff;
  }

  &--warning.ant-btn-primary {
    background-color: @warning-color;
    color: #fff;
  }

  &--error.ant-btn-primary {
    background-color: @error-color;
    color: #fff;
  }

  &.ant-btn {
    border-radius: 8px;
  }

  &.ls-no-border {
    border: none;
  }

  &.ant-btn-info {
    .ant-btn-message,
    .ant-btn-close-icon .anticon.anticon-close {
      color: @link-color;
    }
  }

  &.ant-btn-warning {
    .ant-btn-message,
    .ant-btn-close-icon .anticon.anticon-close {
      color: @warning-color;
    }
  }

  &.ant-btn-success {
    .ant-btn-message,
    .ant-btn-close-icon .anticon.anticon-close {
      color: @success-color;
    }
  }

  &.ant-btn-error {
    .ant-btn-message,
    .ant-btn-close-icon .anticon.anticon-close {
      color: @error-color;
    }
  }
}
</style>
