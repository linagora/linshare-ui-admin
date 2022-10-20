<template>
  <a-collapse class="ls-collapse" v-bind="$attrs" expand-icon-position="right">
    <slot />
  </a-collapse>
</template>
<style lang="less">
.ls-collapse {
  border: none !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 24px;
  background-color: transparent !important;
}
</style>
