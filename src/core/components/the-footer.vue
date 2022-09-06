<template>
  <div class="footer">
    <TheCopyright />
  </div>
</template>

<script lang="ts" setup>
import TheCopyright from './the-copyright.vue';
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-size: 12px;
  line-height: 15px;
  color: @text-color-secondary;

  a {
    margin-left: 4px;
  }
}
</style>
