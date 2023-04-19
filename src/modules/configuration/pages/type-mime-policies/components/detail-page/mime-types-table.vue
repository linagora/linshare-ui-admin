<template>
  <div class="mime-types-table">
    <div class="mime-types-table__action">
      <a-input
        v-model:value="form.searchText"
        :placeholder="$t('MIME_POLICIES.MIME_TYPE_TABLE.SEARCH')"
        class="mime-types-table__action-input"
      />
      <span class="mime-types-table__action-switch">
        {{
          form.enableAll
            ? $t('MIME_POLICIES.MIME_TYPE_TABLE.DISABLE_ALL')
            : $t('MIME_POLICIES.MIME_TYPE_TABLE.ENABLE_ALL')
        }}
        <a-switch
          v-model:checked="form.enableAll"
          :disabled="!isAllowEditEnableAll"
          @change="emits('toggle-all', form.enableAll)"
        />
      </span>
    </div>
    <a-table
      key="uuid"
      class="mime-types-table__table"
      :data-source="mimeTypesByPage"
      :pagination="false"
      :loading="status === STATUS.LOADING"
      :columns="columns"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'mimeType'">
          {{ record.mimeType }}
        </template>
        <template v-if="column.key === 'extensions'">
          {{ record.extensions }}
        </template>
        <template v-if="column.key === 'enable'">
          <a-switch
            v-model:checked="record.enable"
            :disabled="!isAllowEditEnable"
            @change="onToggleMimeType(record, $event)"
          />
        </template>
      </template>
    </a-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!items.length" />
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import ThePagination from '@/core/components/the-pagination.vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';
import { MimeType } from '@/modules/configuration/pages/type-mime-policies/types/MimeType';

// props
const props = defineProps<{
  items: MimeType[];
  status: STATUS;
  editable?: boolean;
}>();
const emits = defineEmits(['toggle', 'toggle-all']);

//data
const form = reactive({
  searchText: '',
  enableAll: true,
});

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

// composable
const { t } = useI18n();

// computed
const mimeTypesBySearch = computed(() => {
  return props.items.filter((item) => `${item.mimeType}-${item.extensions}`.includes(form.searchText));
});
const mimeTypesByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;

  return mimeTypesBySearch.value.slice(firstIndex, lastIndex);
});

const isEnableAll = computed(() => {
  return props.items.every((item) => item.enable);
});

const isAllowEditEnableAll = computed(() => {
  return props.editable;
});

const isAllowEditEnable = computed(() => {
  return props.editable;
});

const columns = computed(() => [
  {
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.MIME_TYPE_NAME'),
    key: 'mimeType',
    sorter: (a: MimeType, b: MimeType) => a.mimeType?.localeCompare(b.mimeType),
  },
  {
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.EXTENTION'),
    key: 'extensions',
    sorter: (a: MimeType, b: MimeType) => a.extensions?.localeCompare(b.extensions),
  },
  {
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.STATUS'),
    key: 'enable',
    align: 'center',
    sorter: (a: MimeType, b: MimeType) => Number(b.enable) - Number(a.enable),
  },
]);

// methods
function onToggleMimeType(mimeType: MimeType, state: boolean) {
  emits('toggle', { item: mimeType, state });
}

watch(
  () => mimeTypesBySearch.value,
  async (newVal) => {
    pagination.total = newVal.length;
  }
);

watch(
  () => isEnableAll.value,
  (newVal) => {
    form.enableAll = newVal;
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less">
.mime-types-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
  }

  &__action {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__action-input {
    background: #fafafa;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    height: 44px;
  }

  &__action-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
  }
}
</style>
