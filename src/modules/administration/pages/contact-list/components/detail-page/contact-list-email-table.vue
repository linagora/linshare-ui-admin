<template>
  <div class="contact-list-email-table">
    <contact-list-detail-header
      :editable="editable"
      :editing="editing"
      @edit-toggle="emits('edit-toggle')"
      @refresh="emits('refresh')"
    ></contact-list-detail-header>
    <a-table
      key="uuid"
      class="contact-list-email-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="filteredListByPage"
      row-key="uuid"
      :loading="status === STATUS.LOADING"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'email'">
          <span class="elipsis-name">{{ record?.mail }}</span>
        </template>
        <template v-if="column.key === 'firstName'">
          <span class="elipsis-name">{{ record?.firstName }}</span>
        </template>
        <template v-if="column.key === 'lastName'">
          <span class="elipsis-name">{{ record?.lastName }}</span>
        </template>
        <template v-if="column.key === 'actions'">
          <a-button :disabled="!editable" class="ls-button ls-position-button" @click="onDeleteContactMail(record)">
            <DeleteFilled class="type-deny" />
          </a-button>
        </template>
      </template>
    </a-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!filteredList.length" />
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, reactive, ref, watch } from 'vue';
import Domain from '@/core/types/Domain';
import { STATUS } from '@/core/types/Status';
import { ContactInfo } from '../../types/Contact';
import useContactList from '../../hooks/useContactList';
import { DeleteFilled } from '@ant-design/icons-vue';
import ContactListDetailHeader from './contact-list-detail-header.vue';
import ThePagination from '@/core/components/the-pagination.vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants/pagination';

const { t } = useI18n();
const { status, activeContactList, filterMail, onDeleteContactMail } = useContactList();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();

const emits = defineEmits(['edit-toggle', 'refresh']);
//data
const selectRule = reactive<{ rule?: 'ALLOW' | 'ALLOW_ALL' | 'DENY' | 'DENY_ALL'; domain?: Domain; domainId?: string }>(
  {}
);
const domains = ref<{ label: string | undefined; value: string; subject: Domain }[]>([]);

// computed
const rules = computed(() => {
  return [
    {
      label: t('CONTACT_LIST.CREATE_MODAL.ALLOW'),
      value: 'ALLOW',
    },
    {
      label: t('CONTACT_LIST.CREATE_MODAL.ALLOW_ALL'),
      value: 'ALLOW_ALL',
    },
    {
      label: t('CONTACT_LIST.CREATE_MODAL.DENY'),
      value: 'DENY',
    },
    {
      label: t('CONTACT_LIST.CREATE_MODAL.DENY_ALL'),
      value: 'DENY_ALL',
    },
  ];
});
const columns = computed(() => [
  {
    width: '30%',
    title: t('CONTACT_LIST.EMAIL'),
    sorter: (a: ContactInfo, b: ContactInfo) => a?.mail.localeCompare(b?.mail || ''),
    key: 'email',
  },
  {
    width: '30%',
    title: t('CONTACT_LIST.FIRST_NAME'),
    sorter: (a: ContactInfo, b: ContactInfo) => a?.firstName?.localeCompare(b?.firstName || ''),
    key: 'firstName',
  },
  {
    width: '30%',
    title: t('CONTACT_LIST.LAST_NAME'),
    sorter: (a: ContactInfo, b: ContactInfo) => a?.lastName.localeCompare(b?.lastName || ''),
    key: 'lastName',
  },
  {
    width: '10%',
    title: t('CONTACT_LIST.ACTIONS'),
    key: 'actions',
  },
]);
const filteredList = computed(() => {
  return activeContactList.value.contacts.filter((item) => {
    return (
      item.mail?.includes(filterMail.value) ||
      item.firstName?.includes(filterMail.value) ||
      item.lastName?.includes(filterMail.value)
    );
  });
});

const filteredListByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;
  return filteredList.value.slice(firstIndex, lastIndex);
});

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});

watch(filteredList, async (newVal) => {
  pagination.total = newVal.length;
  pagination.current =
    pagination.current * pagination.pageSize > pagination.total
      ? Math.floor(pagination.total / pagination.pageSize) || 1
      : pagination.current;
});
</script>

<style lang="less">
.contact-list-email-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 14px;
  width: 100%;
  max-width: 100%;

  &__rule-form {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 8px;
  }

  .title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    max-width: 100%;

    td:nth-child(1),
    th:nth-child(1) {
      max-width: 20vw;
    }

    td:nth-child(2),
    th:nth-child(2) {
      max-width: 20vw;
    }

    td:nth-child(3),
    th:nth-child(3) {
      max-width: 30vw;
    }
  }

  .ant-table-container,
  .ant-table-content {
    width: 100%;
  }

  .ant-table-content {
    overflow-x: scroll;
  }

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 0;
  }

  .ls-input {
    height: 44px;
    background: #fff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .ls-input .ant-select-dropdown {
    top: 0 !important;
    bottom: auto !important;
  }

  .ant-form-item-label {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }

  .ant-form-item-control-input {
    min-height: 42px;
  }

  .ant-col {
    min-height: unset;
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

  .positon {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
  }

  .ls-add {
    height: 44px !important;
    color: #007aff;
    font-size: 14px;
  }

  .ls-position-button {
    height: 32px !important;
    width: 32px !important;
    color: #007aff;
    font-size: 14px;
  }

  .type-allow {
    color: #30cd60;
  }

  .type-deny {
    color: #ea3c3c;
  }
}
</style>
