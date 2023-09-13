<template>
  <div class="domain-policy-detail-header">
    <div class="domain-policy-detail-header__title">
      <strong>{{ $t('EMAIL_TEMPLATES.EDIT_FORM.EDIT_HEADER') }}</strong>
    </div>
    <div class="domain-policy-detail-header__action">
      <a-button class="ls-button" @click="onBackToMimePolicies">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        {{ $t('GENERAL.BACK_TO_LIST') }}
      </a-button>
      <a-button
        v-if="editable && !editing"
        type="primary"
        class="ls-button ls-filled"
        @click="onEditEmailConfiguration"
      >
        <template #icon>
          <EditOutlined />
        </template>
        {{ $t('GENERAL.EDIT') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons-vue';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '@/modules/configuration/pages/email-templates/router';

const router = useRouter();
const route = useRoute();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const emits = defineEmits(['edit-toggle']);
// methods
function onBackToMimePolicies() {
  router.push({ name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION });
}

function onEditEmailConfiguration() {
  emits('edit-toggle');
}
</script>
<style lang="less">
.domain-policy-detail-header {
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
