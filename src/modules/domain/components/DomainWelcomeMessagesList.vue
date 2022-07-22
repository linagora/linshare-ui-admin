<template>
  <PageTitle :title="$t('NAVIGATOR.WELCOME_MESSAGES')" :breadcrumbs="breadcrumbs">
    <template #helperContent>
      <div>
        <span> {{ $t('WELCOME_MESSAGES.DESCRIPTION') }} </span>
        <ul>
          <li>{{ $t('WELCOME_MESSAGES.ROOT_DOMAIN_DESCRIPTION') }}</li>
          <li>{{ $t('WELCOME_MESSAGES.NESTED_DOMAIN_DESCRIPTION') }}</li>
        </ul>
      </div>
    </template>
  </PageTitle>
  <div>
    <div class="actions">
      <a-input v-model:value="filterText" :placeholder="$t('GENERAL.SEARCH_BY_NAME')" class="searchbox" allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <router-link :to="{ name: 'DomainWelcomeMessageNew' }">
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
import PageTitle from '@/core/components/PageTitle.vue';
import StatusValue from '@/core/types/Status';
import ThePagination from '@/core/components/ThePagination.vue';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import useWelcomeMessages from '../hooks/useWelcomeMessages';
import DomainWelcomeMessagesLargeTable from '@/modules/domain/components/DomainWelcomeMessagesLargeTable.vue';
import DomainWelcomeMessagesSmallTable from '@/modules/domain/components/DomainWelcomeMessagesSmallTable.vue';
import { LARGE_SCREEN_BREAK_POINT } from '@/core/constants/breakpoint';

const { filterText, filteredList, pagination, fetchWelcomeMessages } = useWelcomeMessages();
const { t } = useI18n();
const { breadcrumbs } = useBreadcrumbs();
const isLargeScreen = useMediaQuery(LARGE_SCREEN_BREAK_POINT);
const domainStore = useDomainStore();
const currentDomainStatus = computed<StatusValue>(() => domainStore.getStatus('currentDomain'));

watch(currentDomainStatus, (status: StatusValue) => {
  if (status === StatusValue.LOADING) {
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
