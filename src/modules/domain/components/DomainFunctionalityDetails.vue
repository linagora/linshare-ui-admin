<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Functionality } from '@/core/types/Functionality';
import StatusValue from '@/core/types/Status';
import Domain from '../types/Domain';
import PageTitle from '@/core/components/PageTitle.vue';
import DomainFunctionality from './DomainFunctionality.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useFunctionalities from '../hooks/useFunctionalities';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { breadcrumbs } = useBreadcrumbs([
  {
    path: 'DomainFunctionality',
    label: `FUNCTIONALITIES.DETAILS.${route.params.identifier}.NAME`,
  },
]);
const { status } = useFunctionalities();
const show = reactive<Record<string, boolean>>({});
const currentDomain = computed<Domain>(() => store.getters['Domain/getCurrentDomain']);
const mainFunctionality = computed<Functionality | undefined>(() =>
  store.getters['Domain/getFunctionality'](route.params.identifier as string)
);
const subFunctionalities = computed<Functionality[]>(() =>
  store.getters['Domain/getSubFunctionalities'](route.params.identifier as string)
);

watch(
  () => route.params.identifier,
  () => {
    if (!mainFunctionality.value && !route.params.identifier) {
      router.push({ name: 'DomainFunctionalities' });
    }
  }
);
</script>

<template>
  <PageTitle
    :breadcrumbs="breadcrumbs"
    :title="$t(`FUNCTIONALITIES.DETAILS.${route.params.identifier}.NAME`)"
    :subtitle="currentDomain.name"
  ></PageTitle>

  <div v-if="status === StatusValue.LOADING" class="spinner">
    <a-spin />
  </div>

  <a-row v-else>
    <a-col :xs="24" :sm="24" :md="{ span: 16, offset: 4 }">
      <DomainFunctionality
        v-if="mainFunctionality"
        :expand-on-load="true"
        :data="mainFunctionality"
      ></DomainFunctionality>

      <div v-for="functionality in subFunctionalities" :key="functionality.identifier" class="sub-functionality">
        <div class="header">
          <h2>{{ $t(`FUNCTIONALITIES.DETAILS.${functionality.identifier}.NAME`) }}</h2>

          <a-button type="text" @click="show[functionality.identifier] = !show[functionality.identifier]">{{
            show[functionality.identifier] ? 'Collapse' : 'Expand'
          }}</a-button>
        </div>
        <div v-show="show[functionality.identifier]">
          <DomainFunctionality :expand-on-load="false" :data="functionality"></DomainFunctionality>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
.spinner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sub-functionality {
  margin: 30px 0;

  .header {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px @border-color-base;
  }
}
</style>
