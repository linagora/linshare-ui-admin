<template>
  <ul>
    <li>
      <span>{{data.name}}</span>

      <DomainNode v-for="child in data.children" :key="child.uui" :data="child" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import DomainTreeNode from '@/modules/domain/type/DomainTreeNode';

export default defineComponent({
  name: 'DomainNode',
  props: {
    data: {
      default: () => ({}),
      type: Object as PropType<DomainTreeNode>
    }
  }
});
</script>
