<template>
  <div class="email-content-preview">
    <div class="email-content-preview__header">
      <a-button class="show-context" @click="onGetPreviewContent">{{
        $t('EMAIL_TEMPLATES.EMAIL_CONTENT.PREVIEW')
      }}</a-button>
      <a-button class="show-context" @click="onGetPreviewLiveContent">{{
        $t('EMAIL_TEMPLATES.EMAIL_CONTENT.PREVIEW_LIVE')
      }}</a-button>
    </div>
    <div v-if="mailContentPreview.content" class="email-content-preview__body-wrapper">
      <div v-if="loading" class="email-content-preview__body-spin">
        <a-spin />
      </div>
      <template v-else>
        <div class="email-content-preview__subject">
          {{ $t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.SUBJECT') }}: {{ mailContentPreview.subject }}
        </div>
        <div class="email-content-preview__body">
          <div v-html="mailContentPreview.content"></div>
        </div>
      </template>
    </div>
    <div v-else class="email-content-preview__empty">
      {{ $t('EMAIL_TEMPLATES.EMAIL_CONTENT.NO_PREVIEW') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import useEmailTemplatesContent from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesContent';
import { MailConfiguration } from '@/modules/configuration/pages/email-templates/types/MailConfiguration';

const { activeMailContent, activeLanguageCode, handleGetPreviewMailContent, handleGetPreviewLiveMailContent } =
  useEmailTemplatesContent();

const props = defineProps<{
  emailConfigs?: MailConfiguration[];
}>();

let mailContentPreview = ref<{
  subject?: string;
  content?: string;
  language?: string;
  type?: string;
}>({});
const loading = ref(false);

async function onGetPreviewContent() {
  loading.value = true;
  if (!activeMailContent.value.config && props.emailConfigs) {
    activeMailContent.value.config = props.emailConfigs[0].uuid;
  }
  mailContentPreview.value = await handleGetPreviewMailContent(
    activeMailContent.value.uuid,
    activeMailContent.value.config ?? '',
    activeLanguageCode.value
  );
  loading.value = false;
}

async function onGetPreviewLiveContent() {
  loading.value = true;
  if (!activeMailContent.value.config && props.emailConfigs) {
    activeMailContent.value.config = props.emailConfigs[0].uuid;
  }
  mailContentPreview.value = await handleGetPreviewLiveMailContent(
    activeMailContent.value.uuid,
    activeMailContent.value.config ?? '',
    activeLanguageCode.value,
    activeMailContent.value
  );
  loading.value = false;
}
</script>
<style lang="less">
.show-context {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 16px;
  gap: 8px;
  min-width: 89px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #dfe1e6;
  border-radius: 8px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.02em;
  color: #1990ff;
}
.email-content-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__body-wrapper {
    border: 1px solid #fafafa;
    border-radius: 8px;
    padding: 4px;
  }
  &__body {
    width: 100%;
  }
  &__body-spin {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 100%;
  }
  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
  }
  &__subject {
    margin-top: 8px;
    font-size: 18px;
  }
  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    height: 160px;
    background-color: #fafafa;
    border-radius: 8px;
    margin-top: 8px;
  }
}
</style>
