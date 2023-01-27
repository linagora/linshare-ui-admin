<template>
  <div>
    <div>
      <a-alert closable>
        <template #description>
          <span> {{ $t('WELCOME_MESSAGES.DESCRIPTION') }} </span>
          <ul>
            <li>{{ $t('WELCOME_MESSAGES.ROOT_DOMAIN_DESCRIPTION') }}</li>
            <li>{{ $t('WELCOME_MESSAGES.NESTED_DOMAIN_DESCRIPTION') }}</li>
          </ul>
        </template>
      </a-alert>
    </div>
    <div class="actions">
      <a-input v-model:value="filterText" :placeholder="$t('GENERAL.SEARCH_BY_NAME')" class="searchbox" allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <router-link :to="{ name: 'DomainWelcomeMessageNew', params: { domainUuid: currentDomainUuid } }">
        <a-button type="primary">
          <template #icon>
            <PlusCircleOutlined />
          </template>
          {{ $t('GENERAL.CREATE') }}
        </a-button>
      </router-link>
    </div>
  </div>
  <DomainWelcomeMessagesLargeTable v-if="isLargeScreen" />
  <DomainWelcomeMessagesSmallTable v-else />

  <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { useMediaQuery } from '@vueuse/core';
import { STATUS } from '@/core/types/Status';
import ThePagination from '@/core/components/the-pagination.vue';
import useWelcomeMessages from '../hooks/useWelcomeMessages';
import DomainWelcomeMessagesLargeTable from '../components/domain-welcome-messages-large-table.vue';
import DomainWelcomeMessagesSmallTable from '../components/domain-welcome-messages-small-table.vue';
import { LARGE_SCREEN_BREAK_POINT } from '@/core/constants/breakpoint';

const { filterText, filteredList, pagination, fetchWelcomeMessages } = useWelcomeMessages();
const { t } = useI18n();
const isLargeScreen = useMediaQuery(LARGE_SCREEN_BREAK_POINT);
const domainStore = useDomainStore();
const currentDomainUuid = computed(() => domainStore.currentDomain.uuid);
const currentDomainStatus = computed<STATUS>(() => domainStore.getStatus('currentDomain'));

watch(currentDomainStatus, (status: STATUS) => {
  if (status === STATUS.LOADING) {
    fetchWelcomeMessages();
  }
});

onMounted(fetchWelcomeMessages);
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-top: 20px;
}
.actions > .searchbox {
  width: 200px;
  margin-right: 10px;
}

.delete_text {
  color: @error-color;
}

.elipsis-name {
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
</style>
