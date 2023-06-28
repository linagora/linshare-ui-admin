<template>
  <div class="email-configuration-content-table">
    <a-table
      key="uuid"
      class="email-configuration-content-table__table"
      :columns="columns"
      :pagination="false"
      :data-source="mailContentLangsByPage"
      row-key="uuid"
      :loading="status === STATUS.LOADING"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'mailContentType'">
          <a-input v-model:value="search.contentType" placeholder="Main content type" class="ls-input">
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </template>
        <template v-if="column.key === 'mailContent'">
          <a-input v-model:value="search.mailContent" placeholder="Selected mail content" class="ls-input" />
        </template>
        <template v-if="column.key === 'legend'">
          <a-input v-model:value="search.legend" placeholder="Legend" class="ls-input">
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'mailContentType'">
          <span class="elipsis-name">{{ record.mailContentType }}</span>
        </template>
        <template v-else-if="column.key === 'mailContent'">
          <a-select
            :value="record.mailContentString"
            class="ls-input"
            placeholder="Please select mail content"
            :bordered="false"
            :disabled="!editable || !editing"
            @focus="onGetMailContentOptions(record)"
            @select="onChangeMailContent(record, $event)"
          >
            <a-select-option v-for="s in mailContentOptions" :key="s?.label" :value="s?.value">
              {{ s?.label }}
            </a-select-option>
          </a-select>
        </template>
        <template v-if="column.key === 'legend'">
          <span class="elipsis-name">{{ record.legend }}</span>
        </template>
      </template>
    </a-table>
    <ThePagination v-model="pagination" class="pagination" :is-visible="!!mailContentLangs.length" />
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { STATUS } from '@/core/types/Status';
import { SearchOutlined } from '@ant-design/icons-vue';
import { MailLang } from '../../../types/MailConfiguration';
import ThePagination from '@/core/components/the-pagination.vue';
import useEmailTemplatesConfiguration from '../../../hooks/useEmailTemplatesConfiguration';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';

const { t } = useI18n();
const {
  status,
  pagination,
  activeMailConfig,
  activeEmailConfigForm,
  handleGetMailContentList,
  handleUpdateMailContentLang,
} = useEmailTemplatesConfiguration();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const emits = defineEmits(['refresh']);
// data
const search = reactive({
  contentType: '',
  mailContent: '',
  legend: '',
});
const mailContentOptions = ref<{ label: string; value: string }[]>([]);

// computed
const mailContentLangs = computed(() => {
  return activeMailConfig.value?.mailContentLangs
    ?.filter((item) => {
      return item?.language === activeEmailConfigForm?.value?.selectLanguage;
    })
    ?.map((item) => {
      return {
        ...item,
        legend: t(`EMAIL_TEMPLATES.MAIL_CONTENT_TYPE.${item?.mailContentType}`),
        mailContentString: `${item.mailContentDomainName}-Updated the: ${dayjs(item.mailContentModificationDate).format(
          'MMM D, YYYY'
        )}-${item.mailContentName}`,
      };
    });
});
const columns = computed(() => [
  {
    width: '30%',
    title: t('GENERAL.NAME'),
    key: 'mailContentType',
  },
  {
    width: '30%',
    title: t('EMAIL_TEMPLATES.READ_ONLY'),
    key: 'mailContent',
  },
  {
    width: '30%',
    title: t('EMAIL_TEMPLATES.READ_ONLY'),
    key: 'legend',
  },
]);
const mailContentLangsByPage = computed(() => {
  const firstIndex = (pagination.current - 1) * pagination.pageSize;
  const lastIndex = pagination.current * pagination.pageSize;

  return mailContentLangsBySearch.value.slice(firstIndex, lastIndex);
});
const mailContentLangsBySearch = computed(() => {
  return mailContentLangs.value.filter((item) => {
    return (
      item.legend.includes(search.legend) &&
      item.mailContent.includes(search.mailContent) &&
      item.mailContentType.includes(search.contentType)
    );
  });
});
// methods
async function onGetMailContentOptions(item: MailLang) {
  const result = await handleGetMailContentList(
    activeEmailConfigForm?.value?.uuid,
    activeEmailConfigForm?.value?.selectLanguage,
    item?.mailContentType
  );
  mailContentOptions.value = result.map((item) => {
    return { label: `${item.domain}-${item.description}`, value: item.uuid };
  });
}

async function onChangeMailContent(content: MailLang, value: string) {
  const { language, mailConfig, mailContentType, readonly, uuid } = content;
  const payload = {
    language,
    mailConfig,
    mailContentType,
    readonly,
    uuid,
    mailContent: value,
  } as MailLang;

  await handleUpdateMailContentLang(payload);
  emits('refresh');
}

// hooks
watch(
  () => mailContentLangs.value,
  async (newVal) => {
    pagination.total = newVal.length;
  }
);
</script>

<style lang="less">
.email-configuration-content-table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  width: 100%;
  max-width: 100%;

  &__table .ant-table {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    max-width: 100%;
  }

  .ant-table-container,
  .ant-table-content {
    width: 100%;
  }

  .ant-table-content {
    overflow-x: scroll;
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
