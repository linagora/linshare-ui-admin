<template>
  <a-table
    :columns="columns"
    class="diagnostic_table"
    :pagination="false"
    row-key="uuid"
    :loading="loading"
    :data-source="filteredListByPage"
  >
    <template #bodyCell="{ column, record, index }">
      <div
        :class="{
          'selected-row': selectedRow === record,
        }"
        @click="selectedRow = record"
      >
        <template v-if="column.key === 'number'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-else-if="column.key === 'domainName'">
          <span>{{ record.label }}</span>
        </template>
        <template v-else-if="column.key === 'ldap'">
          <span v-if="record.ldap"><SuccessIcon :width="'15'" :height="'15'" /></span>
          <span v-else><CancelCrossIcon :width="'15'" :height="'15'" /></span>
        </template>
        <template v-else-if="column.key === 'database'">
          <span v-if="record.database"><SuccessIcon :width="'15'" :height="'15'" /></span>
          <span v-else><CancelCrossIcon :width="'15'" :height="'15'" /></span>
        </template>
        <template v-else-if="column.key === 'guest'">
          <span v-if="record.guest"><SuccessIcon :width="'15'" :height="'15'" /></span>
          <span v-else><CancelCrossIcon :width="'15'" :height="'15'" /></span>
        </template>
      </div>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useUsersDiagnostic from '@/modules/inconsistent-users/hooks/useUsersDiagnostic';
import { UserDiagnostic } from '../types/UserDiagnotic';
import CancelCrossIcon from '@/core/components/icons/cancel-cross-icon.vue';
import SuccessIcon from '@/core/components/icons/success-icon.vue';

const { t } = useI18n();
const { filteredListByPage, loading } = useUsersDiagnostic();
const selectedRow = ref(null);

const columns = computed(() => [
  {
    dataIndex: 'no',
    key: 'number',
    title: t('INCONSISTENT_USERS.COLUMNS.NUMBER_COL'),
  },
  {
    title: t('GENERAL.DOMAIN'),
    key: 'domainName',
    sorter: (a: UserDiagnostic, b: UserDiagnostic) => a.label?.localeCompare(b.label),
  },

  {
    title: t('INCONSISTENT_USERS.SCRUTINY.LDAP_HEADER'),
    key: 'ldap',
    align: 'center',
  },
  {
    title: t('INCONSISTENT_USERS.SCRUTINY.DATABASE_HEADER'),
    key: 'database',
    align: 'center',
  },
  {
    title: t('INCONSISTENT_USERS.SCRUTINY.GUEST_HEADER'),
    key: 'guest',
    align: 'center',
  },
]);
</script>
<style lang="less">
.diagnostic_table {
  .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    .selected-row {
      background-color: whitesmoke;
      padding: 10px;
      border-radius: 8px;
    }
  }
}
</style>
