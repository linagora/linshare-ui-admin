<template>
  <a-form ref="formRef">
    <a-card flat :bordered="false" class="create-mail-configuration-card">
      <div class="create-mail-configuration-card__title">Create Email configuration</div>
      <div class="create-mail-configuration-card__form">
        <a-form-item class="ls-form-title" v-bind="validateInfos.name" :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.NAME')">
          <a-input
            id="name"
            v-model:value="form.name"
            class="ls-input"
            :placeholder="$t('EMAIL_TEMPLATES.CREATE_MODAL.EMAIL_CONFIGURATION_NAME')"
          ></a-input>
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.domain"
          class="ls-form-title"
          for="name"
          :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.TARGET_DOMAIN')"
        >
          <a-select v-model:value="form.domain" class="ls-input" :bordered="false" @change="onSelectDomain">
            <a-select-option v-for="s in domains" :key="s.label" :value="s.value">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.mailLayout"
          class="ls-form-title"
          for="name"
          :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.MODEL')"
        >
          <a-select
            v-model:value="form.mailLayout"
            :get-popup-container="(triggerNode: HTMLElement) => triggerNode.parentElement"
            class="ls-input"
            :bordered="false"
            @change="onSelectModel"
          >
            <a-select-option v-for="s in models" :key="s" :value="s.value">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="ls-form-title ls-form-title-switch" for="visible">
          <a-switch id="visible" v-model:checked="form.visible" class="ls-switch" />
          <span>{{ $t('EMAIL_TEMPLATES.CREATE_MODAL.VISIBLE') }}</span>
        </a-form-item>
      </div>
      <div class="create-mail-configuration-card__actions">
        <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
        <a-button class="ls-button ls-save" type="primary" @click="onCreateEmailConfiguration">
          <a-spin v-if="loading" />
          <span v-else>{{ $t('GENERAL.CREATE') }}</span>
        </a-button>
      </div>
    </a-card>
  </a-form>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import useEmailTemplatesConfiguration from '../../hooks/useEmailTemplatesConfiguration';
import { getDomains } from '@/modules/domain/services/domain-api';
import { getMailConfigurationList } from '../../services/email-templates-api';
import { message, Form, FormInstance } from 'ant-design-vue';
import Domain from '@/core/types/Domain';
import { MailConfiguration } from '../../types/MailConfiguration';
import { APIError } from '@/core/types/APIError';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';

// props
const emits = defineEmits(['refresh', 'close']);
// composable
const { t } = useI18n();
const useForm = Form.useForm;
const domainStore = useDomainStore();
const { loading, handleCreateMailConfiguration } = useEmailTemplatesConfiguration();

//data
const form = reactive<{
  name: string;
  domain: string | null;
  domainName: string | undefined;
  mailContentLangs: any[];
  mailFooterLangs: any;
  mailLayout: string | undefined;
  visible: boolean;
  readonly: boolean;
}>(getInitialFormData());
const formRef = ref<FormInstance>();
const models = ref<{ label: string | undefined; value: string; subject: MailConfiguration }[]>([]);
const domains = ref<{ label: string | undefined; value: string; subject: Domain }[]>([]);

const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: t('DOMAIN.FIELDS.NAME_REQUIRED'),
      trigger: 'blur',
    },
  ],
  mailLayout: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
  domain: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(form, formRules);
// methods
function getInitialFormData() {
  return {
    name: '',
    domain: domainStore.currentDomain?.uuid,
    domainName: '',
    mailContentLangs: [],
    mailFooterLangs: {},
    mailLayout: '',
    visible: true,
    readonly: false,
  };
}
function resetFormData() {
  Object.assign(form, getInitialFormData());
  resetFields();
}
async function onSelectDomain(value: string, domain: { key: string | undefined; label: string }) {
  form.domainName = domain.key;
  await fetchMailConfiguration();
}

function onSelectModel(
  value: string,
  model: { key: { label: string | undefined; value: string; subject: MailConfiguration } | undefined; label: string }
) {
  form.mailContentLangs = model.key?.subject?.mailContentLangs;
  form.mailFooterLangs = model.key?.subject?.mailFooterLangs;
}

async function onCreateEmailConfiguration() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  const result = await handleCreateMailConfiguration(form);
  if (result) {
    emits('refresh');
    onCloseModal();
  }
}

async function onCloseModal() {
  resetFormData();
  emits('close');
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

async function fetchMailConfiguration() {
  try {
    if (!form.domain) {
      return;
    }
    const messages = await getMailConfigurationList(form.domain, false);
    models.value = messages.map((item) => {
      return { label: item.name, value: item?.uuid, subject: item };
    });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function formValidate() {
  if (!form.name || !form.domain || !form.mailLayout) {
    message.error(t('GENERAL.FIELD_REQUIRED'));
    return false;
  }
  return true;
}

onMounted(async () => {
  await fetchDomains();
  await fetchMailConfiguration();
});
</script>
<style lang="less">
.create-mail-configuration-card {
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
}
</style>
