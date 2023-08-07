<template>
  <div class="email-content-detail-header">
    <div class="email-content-detail-header__title">
      <strong>{{ $t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.PAGE_HEADER') }}</strong>
      <span> {{ activeMailContent.description }} </span>
    </div>
    <div class="email-content-detail-header__action">
      <a-button class="ls-button" @click="onBackToMailContentList">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        {{ $t('GENERAL.BACK_TO_LIST') }}
      </a-button>
      <a-button v-if="editable && !editing" type="primary" class="ls-button ls-filled" @click="onEditEmailContent">
        <template #icon>
          <EditOutlined />
        </template>
        {{ $t('GENERAL.EDIT') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons-vue';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '@/modules/configuration/pages/email-templates/router';
import useEmailTemplatesContent from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesContent';

// composables
const router = useRouter();
const { activeMailContent } = useEmailTemplatesContent();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const emits = defineEmits(['edit-toggle']);

// methods
function onBackToMailContentList() {
  router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONTENT });
}

function onEditEmailContent() {
  emits('edit-toggle');
}
</script>
<style lang="less">
.email-content-detail-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 28px;
  width: 100%;

  &__title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    strong {
      font-weight: 600;
      font-size: 17px;
      line-height: 24px;
      color: #1b1d29;
    }

    span {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      color: #989cb1;
    }
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    .ls-button {
      padding: 0px 20px;
      min-width: 151px;
      height: 44px;
      background: #f3f3f7;
      border-radius: 8px;
      color: #007aff;
    }
    .ls-filled {
      background-color: #007aff;
      color: #f3f3f7;
    }
  }
}
</style>
