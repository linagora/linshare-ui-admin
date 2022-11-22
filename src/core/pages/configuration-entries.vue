<template>
  <div class="configuration-index-page">
    <ls-domain-treeview :node="domainsTree" :is-root="true" :level="1"></ls-domain-treeview>
  </div>
</template>
<script lang="ts" setup>
import LsDomainTreeview from '@/core/components/ls/ls-domain-treeview.vue';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';

const domainStore = useDomainStore();
const { domainsTree } = storeToRefs(domainStore);
</script>
