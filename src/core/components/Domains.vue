<template>
  <div class="domains">
    <a-tree showLine v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys" :defaultExpandAll="true">
      <template #switcherIcon><down-outlined /></template>
      <a-tree-node title="LinShareRootDomain" key="0-0">
        <a-tree-node title="TopDomain" key="0-0-0">
          <a-tree-node title="GuestDomain" key="0-0-0-0" />
          <a-tree-node title="SubDomain" key="0-0-0-1" />
        </a-tree-node>
        <a-tree-node key="0-0-2" title="TopDomain2">
        </a-tree-node>
      </a-tree-node>
    </a-tree>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Domains',
  components: {
    DownOutlined
  }
});
</script>

<style lang="less">
  @import '@/assets/styles/variables';
  .domains {
    width: 100%;
  }
</style>
