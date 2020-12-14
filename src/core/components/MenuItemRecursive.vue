<template>
  <div v-if="havePermission(role, item.permission)">
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
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { havePermission } from '@/core/helper';
import store from '@/core/store';

export default defineComponent({
  name: 'MenuItemRecursive',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },

  setup (_props, { emit }) {
    const role = store.getters['Auth/getLoggedUserRole'];

    function titleClick (e: Event) {
      emit('subMenuClick', e);
    };

    return {
      role,
      titleClick,
      havePermission
    };
  }
});
</script>
