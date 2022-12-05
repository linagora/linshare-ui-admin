<template>
  <a-modal class="ls-modal" v-bind="$attrs">
    <slot name="title"></slot>
    <slot name="centered"></slot>
    <slot name="footer"></slot>
  </a-modal>
</template>
<style lang="less">
.ls-modal {
  .ant-modal-content {
    border-radius: 16px;
  }
}
</style>
