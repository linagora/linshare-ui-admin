<script lang="ts" setup>
import TheMenu from '@/core/components/the-menu.vue';
import MenuIcon from '@/core/components/icons/menu-icon.vue';
</script>

<template>
  <a-dropdown class="the-mobile-menu" :trigger="['click']">
    <button class="button">
      <menu-icon></menu-icon>
    </button>
    <template #overlay>
      <the-menu mode="vertical"></the-menu>
    </template>
  </a-dropdown>
</template>

<style lang="less" scoped>
.the-mobile-menu.button {
  background-color: @primary-color;
  border: none;
  height: 30px;
  width: 30px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
}
</style>
