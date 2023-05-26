<template>
  <div class="email-layout-detail-header">
    <div class="email-layout-detail-header__title">
      <strong>{{ $t('EMAIL_TEMPLATES.EMAIL_LAYOUT.EMAIL_LAYOUT_DETAIL_PAGE.PAGE_HEADER') }}</strong>
      <span> {{ activeMailLayout.description }} </span>
    </div>
    <div class="email-layout-detail-header__action">
      <a-button class="ls-button" @click="onBackToMailLayoutList">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        {{ $t('GENERAL.BACK_TO_LIST') }}
      </a-button>
      <a-button type="primary" class="ls-button ls-filled">
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
import useEmailTemplatesLayout from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesLayout';

const router = useRouter();
const { activeMailLayout } = useEmailTemplatesLayout();
// methods
function onBackToMailLayoutList() {
  router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT });
}
</script>
<style lang="less">
.email-layout-detail-header {
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
