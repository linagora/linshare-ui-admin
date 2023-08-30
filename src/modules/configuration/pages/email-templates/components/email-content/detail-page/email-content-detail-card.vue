<template>
  <a-form ref="formRef">
    <div class="email-content-detail-card">
      <div class="email-content-detail-card__form">
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.description"
          :label="$t('EMAIL_TEMPLATES.EDIT_FORM.NAME_LABEL')"
        >
          <a-input
            v-model:value="activeMailContent.description"
            :disabled="!editable || !editing"
            :placeholder="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.NAME_PLACEHOLDER')"
            class="ls-input"
          />
        </a-form-item>
        <a-form-item
          class="ls-form-title ls-form-switch"
          for="visible"
          :label="$t('EMAIL_TEMPLATES.EDIT_FORM.VISIBLE_LABEL')"
        >
          <a-switch v-model:checked="activeMailContent.visible" :disabled="!editable || !editing" class="ls-switch" />
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.subject"
          :label="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.SUBJECT')"
        >
          <a-input
            v-model:value="activeMailContent.subject"
            :disabled="!editable || !editing"
            :placeholder="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.NAME_PLACEHOLDER')"
            class="ls-input"
          />
        </a-form-item>
        <a-form-item class="ls-form-title" :label="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.BODY')">
          <a-textarea v-model:value="activeMailContent.body" :disabled="!editable || !editing" :rows="12" />
        </a-form-item>
        <div class="ls-form-context">
          <a-form-item
            class="ls-form-title"
            for="layout"
            :label="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.CONTEXT_VARIABLES')"
          >
            <a-select
              v-model:value="activeMailContent.context"
              :disabled="!editable || !editing"
              class="ls-input"
              :placeholder="$t('EMAIL_TEMPLATES.EDIT_FORM.LAYOUT_PLACEHOLDER')"
              :bordered="false"
            >
              <a-select-option v-for="s in emailContextOptions" :key="s?.label" :value="s?.value">
                {{ s?.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-button class="show-context" @click="isShowContext = !isShowContext">{{
            isShowContext
              ? $t('EMAIL_TEMPLATES.EMAIL_CONTENT.SHOW_LESS')
              : $t('EMAIL_TEMPLATES.EMAIL_CONTENT.SHOW_MORE')
          }}</a-button>
        </div>
        <div v-if="isShowContext" class="ls-form-context context-detail">
          <ul v-if="emailContexts[Number(activeMailContent?.context)]?.variables">
            <li
              v-for="(variable, index) in emailContexts[Number(activeMailContent.context)]?.variables"
              :key="index + '__context-detail-variables'"
            >
              <strong>{{ variable.name }}</strong> ({{ variable.type }}): {{ variable.stringValue }}
              <ul v-if="variable?.variables">
                <li
                  v-for="(nestedVariable, nestIndex) in variable?.variables"
                  :key="nestIndex + '__context-detail-variables-nest'"
                >
                  <strong>{{ nestedVariable.name }}</strong> ({{ nestedVariable.type }}):
                  {{ nestedVariable.stringValue }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="ls-form-context">
          <a-form-item
            class="ls-form-title"
            for="layout"
            :label="$t('EMAIL_TEMPLATES.EMAIL_CONTENT.EMAIL_CONTENT_DETAIL_PAGE.MAIL_CONFIGURATION_LIST')"
          >
            <a-select
              v-model:value="activeMailContent.config"
              :disabled="!editable || !editing"
              class="ls-input"
              :placeholder="$t('EMAIL_TEMPLATES.EDIT_FORM.LAYOUT_PLACEHOLDER')"
              :bordered="false"
            >
              <a-select-option v-for="s in emailConfigs" :key="s?.name" :value="s?.uuid">
                {{ s?.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </div>
      <a-form-item class="ls-form-title" :label="$t('EMAIL_TEMPLATES.EDIT_FORM.LANGUAGE_LABEL')">
        <div class="ls-languages">
          <a-button
            v-for="language in languageOptions"
            :key="language?.label"
            class="select-language"
            :class="{ selected: selectedLanguage === language.value }"
            @click="onSelectLanguage(language.value)"
            >{{ language.label }}</a-button
          >
        </div>
      </a-form-item>
      <a-form-item class="ls-form-title">
        <a-textarea v-model:value="activeMailContent[selectedLanguage]" :disabled="!editable || !editing" :rows="6" />
      </a-form-item>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, FormInstance } from 'ant-design-vue';
import useEmailTemplatesContent from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesContent';
import { MailContext } from '../../../types/MailContext';
import { MailConfiguration } from '../../../types/MailConfiguration';

const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const { t } = useI18n();
const { activeMailContent, languageOptions, handleGetMailContentContext, handleGetMailConfigContext } =
  useEmailTemplatesContent();
const selectedLanguage = ref('messagesEnglish');
const isShowContext = ref(false);
const formRef = ref<FormInstance>();
const useForm = Form.useForm;
const emailContexts = ref<MailContext[]>([]);
const emailConfigs = ref<MailConfiguration[]>([]);
const emailContextOptions = computed(() => {
  return [
    {
      label: 'Default scenario',
      value: 0,
    },
  ];
});

const formRules = computed(() => ({
  description: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  content: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  subject: [
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

const { validate, validateInfos, resetFields } = useForm(activeMailContent, formRules);

function onSelectLanguage(language: string) {
  selectedLanguage.value = language;
}
async function onGetEmailContext() {
  emailContexts.value = await handleGetMailContentContext(activeMailContent.value?.uuid);
  activeMailContent.value.context = 0;
}
async function onGetEmailConfig() {
  emailConfigs.value = await handleGetMailConfigContext(activeMailContent.value?.domain);
}

onMounted(() => {
  onGetEmailContext();
  onGetEmailConfig();
});

defineExpose({
  validate,
});
</script>
<style lang="less">
.email-content-detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  &__name {
    .aterisk {
      color: #ea3c3c;
    }
  }

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
  .context-detail {
    background: #fff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    padding: 8px;
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
    margin-bottom: 10px;
  }

  .ant-form-item-label {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }

  .ant-form-item-label label {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }

  .ls-form-switch .ant-form-item-control {
    margin-top: -12px;
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

  .select-language,
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
    color: #3d3f49;
  }
  .show-context {
    color: #1990ff;
  }

  .select-language.selected {
    background: #e8f4ff;
    color: #1990ff;
    border-color: #e8f4ff;
  }

  .ls-languages {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
  }

  .ls-form-content-language {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .ls-form-content-language .ls-input-field {
    width: 30%;
    min-width: 30%;
  }

  .ls-form-content-language .ls-select-field {
    flex-grow: 1;
    flex-shrink: 1;
  }
  .ant-select-selection-item {
    line-height: 40px !important;
  }
}

.content-preview-card {
  overflow: auto;
  max-height: 300px;
}

.ls-form-context {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
}
.ls-form-context .show-context {
  margin-bottom: 10px;
  height: 44px;
}
.ls-form-context .ls-form-title {
  width: 240px;
}
</style>
