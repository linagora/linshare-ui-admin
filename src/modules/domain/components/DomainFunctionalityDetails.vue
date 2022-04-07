<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Functionality } from '@/core/types/Functionality';
import StatusValue from '@/core/types/Status';
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
const { status, getTranslatedText } = useFunctionalities();
const show = reactive<Record<string, boolean>>({});
const main = computed<Functionality | undefined>(() =>
  store.getters['Domain/getFunctionality'](route.params.identifier as string)
);
const subs = computed<Functionality[]>(() =>
  store.getters['Domain/getSubFunctionalities'](route.params.identifier as string)
);
const functionalities = computed(() => [main.value, ...subs.value]);

watch(
  () => route.params.identifier,
  (newId) => {
    if (!main.value && newId) {
      router.push({ name: 'DomainFunctionalities' });
    }
  }
);
</script>

<template>
  <PageTitle :breadcrumbs="breadcrumbs"></PageTitle>

  <div v-if="status === StatusValue.LOADING" class="spinner">
    <a-spin />
  </div>

  <a-row v-else>
    <a-col :md="24" :xl="{ span: 12, offset: 6 }">
      <div v-for="functionality in functionalities" :key="functionality?.identifier">
        <div v-if="functionality" class="functionality">
          <div class="header">
            <div class="status">
              <a-tag :color="functionality.activationPolicy.enable.value ? 'success' : 'error'">{{
                $t(functionality.activationPolicy.enable.value ? 'GENERAL.ENABLED' : 'GENERAL.DISABLED')
              }}</a-tag>
            </div>

            <div class="title">
              <h2>{{ $t(`FUNCTIONALITIES.DETAILS.${functionality.identifier}.NAME`) }}</h2>
            </div>
            <a-button
              v-if="functionality.parentIdentifier"
              type="text"
              @click="show[functionality.identifier] = !show[functionality.identifier]"
            >
              {{ $t(show[functionality.identifier] ? 'GENERAL.COLLAPSE' : 'GENERAL.EXPAND') }}
            </a-button>
          </div>

          <div v-show="!functionality.parentIdentifier || show[functionality.identifier]">
            <p class="description">{{ getTranslatedText(functionality, 'DESCRIPTION') }}</p>

            <DomainFunctionality :expand-on-load="false" :data="functionality"></DomainFunctionality>
          </div>
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

.functionality {
  margin: 30px 0;

  .description {
    color: @text-color-secondary;
  }

  .header {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px @border-color-base;

    .status {
      flex: 0 0 80px;
      display: flex;
      align-items: center;
      margin-bottom: 0.5em;
    }
    .title {
      flex: 1;
    }
  }
}
</style>
