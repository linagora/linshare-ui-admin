<template>
  <a-sub-menu :key="item.key" v-if="item.items && item.items.length" @titleClick="titleClick">
    <template v-slot:title>
      <span>
        <component :is="item.icon" />
        <span>{{ $t(item.name) }}</span>
      </span>
    </template>
    <MenuItemRecursive v-for="i in item.items" :key="i.key" :item="i" />
  </a-sub-menu>
  <a-menu-item :key="item.key" v-else>
    <span>
      <component :is="item.icon" />
      <span>{{ $t(item.name) }}</span>
    </span>
  </a-menu-item>
</template>

<script lang='ts'>

export default {
  name: 'MenuItemRecursive',
  props: ['item'],
  methods: {
    titleClick (e: Event) {
      console.log('titleClick', e);
    }
  }
};
</script>

<style lang="less">

</style>
