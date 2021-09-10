<template>
  <a-row :gutter="32">
    <a-col
      :span="6"
      wrap
    >
      <DomainTrees />
    </a-col>
    <a-col :span="18">
      <router-view />
    </a-col>
  </a-row>
</template>

<script lang='ts'>
import { useStore } from 'vuex';
import { defineComponent, watchEffect, computed } from 'vue';
import DomainTrees from '@/modules/domain/components/DomainsTree.vue';

export default defineComponent({
  name: 'Configuration',
  components: {
    DomainTrees
  },
  setup () {
    const store = useStore();
    const domainsTree = computed(() => store.getters['Domain/getDomainsTree']);

    watchEffect(() => {
      if (domainsTree.value.uuid) {
        store.dispatch('Domain/fetchDomainById', domainsTree.value.uuid);
      }
    });
  }
});
</script>
