<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useDomainStore } from '@/modules/domain/store';
import { Functionality } from '../types/Functionality';
import { STATUS } from '@/core/types/Status';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
import DomainFunctionality from './domain-functionality.vue';
import useFunctionalities from '../hooks/useFunctionalities';
import { APIError } from '@/core/types/APIError';
import { getFunctionality, getFunctionalties } from '../services/parameters-api';

const route = useRoute();
const router = useRouter();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const { getTranslatedText } = useFunctionalities();
const status = ref<STATUS>(STATUS.LOADING);
const show = reactive<Record<string, boolean>>({});
const functionalities = ref<Functionality[]>([]);
const functionalityId = route.params.identifier as string;

function onFunctionalityUpdate(updated: Functionality) {
  const index = functionalities.value.findIndex((func) => func.identifier === updated.identifier);

  functionalities.value.splice(index, 1, updated);
}

async function fetchFunctionalities() {
  try {
    status.value = STATUS.LOADING;
    functionalities.value = [
      await getFunctionality(currentDomain.value.uuid, functionalityId),
      ...(await getFunctionalties(currentDomain.value.uuid, { parent: functionalityId })),
    ];
    status.value = STATUS.SUCCESS;
  } catch (error) {
    status.value = STATUS.ERROR;

    if (error instanceof APIError) {
      message.error(error.getMessage());

      if (error.errorCode === 14004) {
        router.push({ name: 'DomainFunctionalities' });
      }
    }
  }
}

watch(
  () => route.params.identifier,
  (identifier) => {
    if (identifier) {
      fetchFunctionalities();
    }
  }
);

onMounted(fetchFunctionalities);
</script>

<template>
  <router-link :to="{ name: 'ConfigurationDomainParameters' }">
    <ArrowLeftIcon></ArrowLeftIcon>
  </router-link>

  <div v-if="status === STATUS.LOADING" class="spinner">
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

            <DomainFunctionality :data="functionality" @updated="onFunctionalityUpdate"></DomainFunctionality>
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
