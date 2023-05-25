<template>
  <a-form ref="formRef">
    <a-card flat :bordered="false" class="create-mail-layout-card">
      <div class="create-mail-layout-card__title">{{ $t('EMAIL_TEMPLATES.CREATE_MODAL.CREATE_EMAIL_LAYOUT') }}</div>
      <div class="create-mail-layout-card__form">
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.description"
          :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.NAME')"
        >
          <a-input
            id="description"
            v-model:value="form.description"
            class="ls-input"
            :placeholder="$t('EMAIL_TEMPLATES.CREATE_MODAL.EMAIL_LAYOUT_NAME')"
          ></a-input>
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.domainName"
          class="ls-form-title"
          :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.TARGET_DOMAIN')"
        >
          <a-select v-model:value="form.domainName" class="ls-input" :bordered="false" @change="onSelectDomain">
            <a-select-option v-for="s in domains" :key="s.value" :value="s.label">
              {{ s.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.layout"
          class="ls-form-title"
          :label="$t('EMAIL_TEMPLATES.CREATE_MODAL.MODEL')"
        >
          <a-select
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
      <div class="create-mail-layout-card__actions">
        <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
        <a-button class="ls-button ls-save" type="primary">
          <a-spin v-if="loading" />
          <span v-else @click="onCreateEmailLayout">{{ $t('GENERAL.CREATE') }}</span>
        </a-button>
      </div>
    </a-card>
  </a-form>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import useEmailTemplatesLayout from '../../hooks/useEmailTemplatesLayout';
import { getDomains } from '@/modules/domain/services/domain-api';
import { getMailLayoutList } from '../../services/email-templates-api';
import { message, Form, FormInstance } from 'ant-design-vue';
import Domain from '@/core/types/Domain';
import { APIError } from '@/core/types/APIError';
import { useDomainStore } from '@/modules/domain/store';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { MailLayout } from '../../types/MailLayout';

// props
const emits = defineEmits(['refresh', 'close']);
// composable
const { t } = useI18n();
const useForm = Form.useForm;
const { loading, handleCreateMailLayout } = useEmailTemplatesLayout();
const domainStore = useDomainStore();
const route = useRoute();
const { currentDomain } = storeToRefs(domainStore);
//data
const form = reactive<{
  description: string;
  domain: string;
  domainName: string;
  layout: string;
  messagesEnglish: string;
  messagesFrench: string;
  messagesRussian: string;
  visible: boolean;
  readonly: boolean;
}>(getInitialFormData());
const formRef = ref<FormInstance>();
const models = ref<{ label: string | undefined; value: string; subject: MailLayout }[]>([]);
const domains = ref<{ label: string | undefined; value: string; subject: Domain }[]>([]);

const formRules = computed(() => ({
  description: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  layout: [
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
}));
const { validate, validateInfos, resetFields } = useForm(form, formRules);
// methods
function getInitialFormData() {
  return {
    description: '',
    domain: '',
    domainName: '',
    messagesEnglish: '',
    messagesFrench: '',
    messagesRussian: '',
    layout: '',
    visible: true,
    readonly: false,
  };
}
function resetFormData() {
  Object.assign(form, getInitialFormData());
  resetFields();
}

async function onCloseModal() {
  resetFormData();
  emits('close');
}

async function onCreateEmailLayout() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  await handleCreateMailLayout(form);
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

async function fetchMailLayoutList() {
  try {
    if (!form.domain) {
      return;
    }
    const messages = await getMailLayoutList(form.domain, false);
    models.value = messages.map((item) => {
      return { label: item.description, value: item?.uuid, subject: item };
    });
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

async function onSelectDomain(value: string, domain: { key: string; label: string }) {
  form.domain = domain.key;
  await fetchMailLayoutList();
}

function onSelectModel(
  value: string,
  model: { key: { label: string | undefined; value: string; subject: MailLayout }; label: string }
) {
  form.layout = model.key.subject.layout;
  form.messagesEnglish = model.key.subject.messagesEnglish;
  form.messagesFrench = model.key.subject.messagesFrench;
  form.messagesRussian = model.key.subject.messagesRussian;
}

onMounted(async () => {
  await fetchDomains();
  const domainToLoad = {
    key: currentDomain.value.uuid,
    label: currentDomain.value.name,
  };
  form.domain = currentDomain.value.uuid;
  form.domainName = currentDomain.value.name;
  await fetchMailLayoutList();
  onSelectDomain(currentDomain.value.uuid, domainToLoad);
});
watch(route, (newRoute) => {
  if (newRoute) {
    form.domainName = currentDomain.value.name;
  }
});
</script>

<style lang="less">
.create-mail-layout-card {
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
