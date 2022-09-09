<script lang="ts" setup>
import LsTable, { LsTableColumn } from '@/core/components/ls/ls-table.vue';
import { isEmail } from '@/core/utils/is-email';
import { getReadableSize } from '@/core/utils/unitStorage';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AccountQuotaStatistic } from '../types/AccountQuotaStatistic';

defineProps<{
  data: AccountQuotaStatistic[];
  loading: boolean;
}>();
const { t } = useI18n();
const columns = computed<LsTableColumn[]>(() => [
  {
    title: t('GENERAL.NUMBER_COL'),
    width: '70px',
    key: 'number',
    align: 'center',
  },
  {
    title: t('GENERAL.NAME'),
    key: 'name',
    sorter: (a: AccountQuotaStatistic, b: AccountQuotaStatistic) => a.account.name.localeCompare(b.account.name),
  },
  {
    title: t('USERS.DETAIL_USER.MAIL'),
    key: 'email',
    sorter: (a: AccountQuotaStatistic, b: AccountQuotaStatistic) => a.account.email.localeCompare(b.account.email),
  },
  {
    title: t('GENERAL.DOMAIN'),
    key: 'domain',
    sorter: (a: AccountQuotaStatistic, b: AccountQuotaStatistic) => a.domain.name.localeCompare(b.domain.name),
  },
  {
    title: t('REPORTING.USER_USED_STORAGE.TABLE_STORAGE_COLUMN_HEADER'),
    key: 'usedSpace',
    sorter: (a: AccountQuotaStatistic, b: AccountQuotaStatistic) => a.usedSpace - b.usedSpace,
  },
]);
</script>

<template>
  <ls-table class="used-storage-table" :data-source="data" :loading="loading" :columns="columns">
    <template #bodyCell="{ column, row, index }">
      <template v-if="column.key === 'number'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.key === 'name'">
        <div class="account-name">
          <router-link
            :to="{
              name: isEmail(row.account.email) ? 'UserDetail' : 'SharedSpaceDetails',
              params: {
                id: row.account.uuid,
              },
            }"
          >
            {{ row.account.name }}
          </router-link>

          <span class="email">
            {{ isEmail(row.account.email) ? row.account.email : 'N/A' }}
          </span>
        </div>
      </template>
      <template v-else-if="column.key === 'email'">
        {{ isEmail(row.account.email) ? row.account.email : 'N/A' }}
      </template>
      <template v-else-if="column.key === 'domain'">
        {{ row.domain.name }}
      </template>
      <template v-else-if="column.key === 'usedSpace'">
        {{ getReadableSize(row.usedSpace).getText() }}
      </template>
    </template>
  </ls-table>
</template>

<style lang="less" scoped>
.used-storage-table {
  :deep(th:nth-child(3)) {
    display: none;
  }

  :deep(td:nth-child(3)) {
    display: none;
  }
}
.account-name {
  display: flex;
  flex-direction: column;

  .email {
    color: @text-color-secondary;
  }
}

@media (min-width: @screen-xl-min) {
  .used-storage-table {
    :deep(th:nth-child(3)) {
      display: table-cell;
    }

    :deep(td:nth-child(3)) {
      display: table-cell;
    }
  }

  .account-name .email {
    display: none;
  }
}
</style>
