<template>
   <a-row :gutter="32">
    <a-col :span="6" wrap>
      <Suspense>
        <template #default>
         <DomainTrees />
        </template>
        <template #fallback>
          <a-skeleton active />
        </template>
      </Suspense>
    </a-col>
    <a-col :span="18">
      <router-view />
    </a-col>
  </a-row>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import DomainTrees from '@/modules/domain/components/DomainsTree.vue';

export default defineComponent({
  name: 'Configuration',
  components: {
    DomainTrees
  }
});
</script>
