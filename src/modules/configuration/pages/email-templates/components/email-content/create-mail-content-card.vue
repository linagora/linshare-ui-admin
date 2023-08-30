<template>
  <a-form ref="formRef">
    <a-card flat :bordered="false" class="create-mail-content-card">
      <div class="create-mail-content-card__title">{{ $t('EMAIL_TEMPLATES.EMAIL_CONTENT.CREATE_EMAIL_CONTENT') }}</div>
      <div class="create-mail-content-card__form">
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.description"
          :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.NAME')"
        >
          <a-input
            id="description"
            v-model:value="form.description"
            class="ls-input"
            :placeholder="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_NAME')"
          ></a-input>
        </a-form-item>
        <a-form-item class="ls-form-title" :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.TARGET_DOMAIN')">
          <a-select v-model:value="form.domainName" class="ls-input" :bordered="false" @change="onSelectDomain">
            <a-select-option v-for="s in domains" :key="s.value" :value="s.label">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.mailContentType"
          class="ls-form-title"
          :label="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.CONTENT_TYPE')"
        >
          <a-select
            v-model:value="form.mailContentType"
            :get-popup-container="(triggerNode: HTMLElement) => triggerNode.parentElement"
            class="ls-input"
            :bordered="false"
          >
            <a-select-option v-for="s in mailContentTypeOptions" :key="s" :value="s.value">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="form.mailContentType"
          class="ls-form-title"
          :label="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.DUPPLICATE_FROM')"
        >
          <a-select
            v-model:value="form.content"
            :get-popup-container="(triggerNode: HTMLElement) => triggerNode.parentElement"
            class="ls-input"
            :bordered="false"
            @change="onSelectModel"
          >
            <a-select-option v-for="s in dupplicateFromOptions" :key="s" :value="s.value">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="ls-form-title ls-form-title-switch" for="visible">
          <a-switch id="visible" v-model:checked="form.visible" class="ls-switch" />
          <span>{{ $t('EMAIL_TEMPLATES.CREATE_MODAL.VISIBLE') }}</span>
        </a-form-item>
      </div>
      <div class="create-mail-content-card__actions">
        <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
        <a-button class="ls-button ls-save" type="primary" @click="onCreateEmailContent">
          <a-spin v-if="loading" />
          <span v-else>{{ $t('GENERAL.CREATE') }}</span>
        </a-button>
      </div>
    </a-card>
  </a-form>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import useEmailTemplatesContent from '../../hooks/useEmailTemplatesContent';
import { getDomains } from '@/modules/domain/services/domain-api';
import { message, Form, FormInstance } from 'ant-design-vue';
import Domain from '@/core/types/Domain';
import { APIError } from '@/core/types/APIError';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { MailContent } from '../../types/MailContent';
import { MAIL_CONTENT_TYPE } from '../../utils/mail-content-types';
import { getContentEmailTemplates } from '../../services/email-templates-api';
// props
const emits = defineEmits(['refresh', 'close']);
// composable
const { t } = useI18n();
const useForm = Form.useForm;
const { loading, handleCreateMailContent, onCheckDefaultEmailContent } = useEmailTemplatesContent();
const domainStore = useDomainStore();
const route = useRoute();
const { currentDomain } = storeToRefs(domainStore);
//data
const form = reactive<{
  description: string;
  domain: string;
  domainName: string;
  content: string;
  body: string;
  subject: string;
  mailContentType: string;
  messagesEnglish: string;
  messagesFrench: string;
  messagesRussian: string;
  messagesVietnamese: string;
  visible: boolean;
  readonly: boolean;
}>(getInitialFormData());
const formRef = ref<FormInstance>();
const models = ref<{ label: string | undefined; value: string; mailContentType: string; subject: MailContent }[]>([]);
const domains = ref<{ label: string | undefined; value: string; subject: Domain }[]>([]);

// computed
const formRules = computed(() => ({
  description: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  domainName: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  mailContentType: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(form, formRules);

const mailContentTypeOptions = computed(() => {
  return Object.keys(MAIL_CONTENT_TYPE).map((key) => {
    return {
      label: t(`EMAIL_TEMPLATES.MAIL_CONTENT_TYPE.${key}`),
      value: key,
    };
  });
});

const dupplicateFromOptions = computed(() => {
  return models.value.filter((item) => item.mailContentType === form.mailContentType);
});
// methods
function getInitialFormData() {
  return {
    description: '',
    domain: '',
    body: '',
    subject: '',
    domainName: '',
    mailContentType: '',
    messagesEnglish: '',
    messagesFrench: '',
    messagesRussian: '',
    messagesVietnamese: '',
    content: '',
    visible: true,
    readonly: false,
  };
}

async function getDupplicateFrom() {
  try {
    const templates = await getContentEmailTemplates(form.domain, false);
    models.value = templates.map((item) => {
      return {
        label:
          item?.description ||
          (onCheckDefaultEmailContent(item) ? t('EMAIL_TEMPLATES.EMAIL_CONTENT.DEFAULT_MAIL_CONTENT') : ''),
        value: item?.uuid,
        mailContentType: item?.mailContentType,
        subject: item,
      };
    });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}
function resetFormData() {
  Object.assign(form, getInitialFormData());
  resetFields();
}

async function onCloseModal() {
  resetFormData();
  emits('close');
}

async function onCreateEmailContent() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  await handleCreateMailContent(form);
  emits('refresh');
  onCloseModal();
}

async function fetchDomains() {
  try {
    const response = await getDomains({ params: { tree: false } });
    domains.value = (response as Domain[]).map((item) => {
      return { label: item.name, value: item?.uuid, subject: item };
    });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function onSelectDomain(value: string, domain: { key: string; label: string }) {
  form.domain = domain.key;
  getDupplicateFrom();
}

function onSelectModel(
  value: string,
  model: { key: { label: string | undefined; value: string; subject: MailContent }; label: string }
) {
  form.messagesEnglish = model.key.subject?.messagesEnglish;
  form.messagesFrench = model.key.subject?.messagesFrench;
  form.messagesRussian = model.key.subject?.messagesRussian;
  form.messagesVietnamese = model.key.subject?.messagesVietnamese;
  form.body = model.key.subject?.body;
  form.subject = model.key.subject?.subject;
}

onMounted(async () => {
  await fetchDomains();
  const domainToLoad = {
    key: currentDomain.value.uuid,
    label: currentDomain.value.name,
  };
  form.domain = currentDomain.value.uuid;
  form.domainName = currentDomain.value.name;
  onSelectDomain(currentDomain.value.uuid, domainToLoad);
});
watch(route, (newRoute) => {
  if (newRoute) {
    form.domainName = currentDomain.value.name;
  }
});
</script>

<style lang="less">
.create-mail-content-card {
  border-radius: 25px;
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border: none;
  }

  &__title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    width: 100%;
    color: #1b1d29;
    text-align: center;
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 28px;

    .ls-button {
      flex-grow: 1;
    }

    .ls-cancel,
    .ls-cancel:hover {
      background-color: #f3f3f7;
      color: #007aff;
      border-color: #f3f3f7;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
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

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 0;
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

  .ls-form-title-switch .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row !important;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    width: fit-content;
    color: #434657;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    font-weight: normal;
  }

  .ls-switch {
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

  .ant-select-selector {
    height: 100% !important;
    border-radius: 10px;
  }

  .ant-select-single .ant-select-selector .ant-select-selection-item,
  .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
    line-height: 40px;
  }
}
</style>
