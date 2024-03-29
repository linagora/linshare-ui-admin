<template>
  <div class="email-activation-table">
    <a-table
      key="uuid"
      class="email-activation-table__table"
      :data-source="mailActivationByPage"
      :pagination="false"
      :loading="status === STATUS.LOADING"
      row-key="uuid"
      :columns="columns"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'identifier'">
          <div class="email-activation-table__search">
            <a-input
              v-model:value="search.identifier"
              :placeholder="$t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.CONTENT_TYPE_NAME')"
              class="ls-input"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <!-- <a-input v-model:value="search.type" placeholder="State" class="ls-input">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input> -->
            <a-select
              v-model:value="search.type"
              :placeholder="$t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.STATE')"
              allow-clear
              :get-popup-container="(triggerNode: HTMLElement) =>triggerNode.parentElement"
              class="ls-input ls-selector"
              :options="typeOptions"
            ></a-select>
          </div>
        </template>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'identifier'">
          <email-activation-detail
            :index="index"
            :item="record"
            @expand="activeRecord = $event"
            @reload="emits('reload')"
          ></email-activation-detail>
        </template>
      </template>
    </a-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!items?.length" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import ThePagination from '@/core/components/the-pagination.vue';
import { MailActivation } from '../../types/MailActivation';
import useEmailTemplatesActivation from '../../hooks/useEmailTemplatesActivation';
import EmailActivationDetail from './email-activation-detail.vue';
import { SearchOutlined } from '@ant-design/icons-vue';

// props
const props = defineProps<{
  items: MailActivation[];
  status: STATUS;
  editable?: boolean;
}>();
const emits = defineEmits(['reload']);
const activeRecord = ref<MailActivation | null>(null);
// composable
const { t } = useI18n();
const { pagination } = useEmailTemplatesActivation();

const search = reactive({
  identifier: '',
  type: null,
});
// computed

const typeOptions = computed(() => {
  return [
    { label: t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.ACTIVE'), value: true },
    { label: t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.INACTIVE'), value: false },
  ];
});

const mailActivationByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return mailActivationsBySearch.value.slice(firstIndex, lastIndex);
});

const mailActivationsBySearch = computed(() => {
  return (
    props.items.filter(
      (item) =>
        item.identifier?.toLowerCase().includes(search.identifier?.toLowerCase()) &&
        (search.type == null || item.enable === search.type)
    ) || []
  );
});

const columns = computed(() => [
  {
    title: t('GENERAL.NAME'),
    key: 'identifier',
  },
]);

watch(
  () => props.items,
  async (newVal) => {
    pagination.total = newVal?.length;
  }
);
</script>

<style lang="less">
.email-activation-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow-x: auto;
    width: 100%;
    min-width: 100%;
  }
  .ant-table-cell {
    padding: 0 !important;
  }

  .ant-tag.ant-tag-success {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #eefff2;
    border-radius: 5px;
    color: #30cd60;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  .ant-tag.ant-tag-red {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #fff3f3;
    border-radius: 5px;
    color: #ea3c3c;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  .ant-tag.ant-tag-default {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #f3f3f7;
    border-radius: 5px;
    color: #989cb1;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  &__dropdown {
    background-color: transparent !important;
    box-shadow: none !important;

    .ant-dropdown-menu {
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-dropdown-menu-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      letter-spacing: -0.02em;
    }
    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
    }

    svg {
      color: #007aff;
    }
    .delete svg {
      color: #ea3c3c;
    }

    .ant-dropdown-menu-item:hover {
      color: #007aff;
    }
  }
  &__item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
  }
  &__item-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
  &__item-status {
    padding: 16px;
  }
  &__item-identifier {
    padding: 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    flex-grow: 1;
  }
  &__item-expand {
    color: @primary-color;
    font-weight: 400;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  &__search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px;
  }

  .ls-input {
    height: 44px;
    min-width: 40%;
    background: #fff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      height: 100% !important;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .ls-select {
    width: 30%;
    min-width: 30%;
  }

  .ls-input .ant-select-dropdown {
    top: 0 !important;
    bottom: auto !important;
  }

  &__dropdown {
    background-color: transparent !important;
    box-shadow: none !important;

    .ant-dropdown-menu {
      padding: 8px;
      gap: 8px;
      height: 164px;
      background: #ffffff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }

    .ant-dropdown-menu-item {
      height: 48px;
      border-radius: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      letter-spacing: -0.02em;
    }

    .ant-dropdown-menu-title-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
    }

    svg {
      color: #007aff;
    }

    .delete svg {
      color: #ea3c3c;
    }

    .ant-dropdown-menu-item:hover {
      color: #007aff;
    }
  }
}
</style>
