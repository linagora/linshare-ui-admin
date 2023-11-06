<script lang="ts" setup>
import { isEmail } from '@/core/utils/is-email';
import { getReadableSize } from '@/core/utils/unitStorage';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AccountQuotaStatistic } from '../types/AccountQuotaStatistic';
import { MY_SHARED_SPACES_ROUTE_NAMES } from '@/modules/shared-spaces/router/index';
const props = defineProps<{
  data: AccountQuotaStatistic[];
  loading: boolean;
}>();
const usedSpaceData = computed(() => {
  return props.data.filter((data) => data.usedSpace !== 0);
});
const { t } = useI18n();
const columns = computed(() => [
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
  <a-table
    class="used-storage-table"
    :data-source="usedSpaceData"
    :pagination="false"
    :loading="loading"
    :columns="columns"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'number'">
        {{ index + 1 }}
      </template>
      <template v-else-if="column.key === 'name'">
        <div class="account-name">
          <router-link
            :to="{
              name: isEmail(record.account.email) ? 'UserDetail' : MY_SHARED_SPACES_ROUTE_NAMES.SHARE_SPACES_DETAIL,
              params: {
                id: record.account.uuid,
              },
            }"
          >
            {{ record.account.name }}
          </router-link>

          <span class="email">
            {{ isEmail(record.account.email) ? record.account.email : 'N/A' }}
          </span>
        </div>
      </template>
      <template v-else-if="column.key === 'email'">
        {{ isEmail(record.account.email) ? record.account.email : 'N/A' }}
      </template>
      <template v-else-if="column.key === 'domain'">
        {{ record.domain.name }}
      </template>
      <template v-else-if="column.key === 'usedSpace'">
        {{ getReadableSize(record.usedSpace).getText() }}
      </template>
    </template>
  </a-table>
</template>

<style lang="less">
.used-storage-table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow-x: auto;
  }
}
</style>
<style lang="less" scoped>
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
