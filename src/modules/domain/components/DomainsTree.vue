<template>
  <a-skeleton
    v-if="isLoadingTree"
    active
  />

  <div
    v-else
    class="domains-tree"
  >
    <ul>
      <DomainsTreeNode :node="domainsTree" />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import Status from '@/core/types/Status';
import DomainsTreeNode from './DomainsTreeNode.vue';

const store = useStore();
const domainsTree = computed(() => store.getters['Domain/getDomainsTree']);
const isLoadingTree = computed(() => store.getters['Domain/getStatus']('domainsTree') === Status.LOADING);
</script>

<style lang="less">
  .domains-tree {
    &__node {
      display: flex;
      margin: 10px 0;

      .name {
        max-width: calc(100% - 40px);
        font-size: 14px;
        background: @background-color-base;
        font-weight: 400;
      }

      .name.active {
        background: @primary-1;
      }

      .name.ant-btn > span {
        overflow: hidden;
        max-width: 100%;
        text-overflow: ellipsis;
      }

      .name:not(:only-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .dropdown-btn.ant-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    li {
      list-style-type: none;
      position: relative;
    }

    li::before {
      position: absolute;
      left: 25px;
      width: 1px;
      height: 100%;
      margin: 22px 0 0;
      height: calc(100% - 40px);
      border-left: 1px solid @border-color-base;
      content: ' ';
    }
  }
</style>
