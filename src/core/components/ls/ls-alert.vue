<template>
  <a-alert class="ls-alert" v-bind="$attrs" :class="{ 'ls-no-border': !border }">
    <template v-for="slot in Object.keys($slots)" #[slot]>
      <slot :name="slot" />
    </template>
  </a-alert>
</template>
<script lang="ts" setup>
interface Props {
  border?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  border: false,
});
</script>
<style lang="less">
@import '@/core/styles/main.less';

.ls-alert {
  &.ant-alert {
    border-radius: 8px;
    padding: 12px 16px;
  }

  &.ls-no-border {
    border: none;
  }

  &.ant-alert-info {
    .ant-alert-message,
    .ant-alert-close-icon .anticon.anticon-close {
      color: @link-color;
    }
  }

  &.ant-alert-warning {
    .ant-alert-message,
    .ant-alert-close-icon .anticon.anticon-close {
      color: @warning-color;
    }
  }

  &.ant-alert-success {
    .ant-alert-message,
    .ant-alert-close-icon .anticon.anticon-close {
      color: @success-color;
    }
  }

  &.ant-alert-error {
    .ant-alert-message,
    .ant-alert-close-icon .anticon.anticon-close {
      color: @error-color;
    }
  }
}
</style>
