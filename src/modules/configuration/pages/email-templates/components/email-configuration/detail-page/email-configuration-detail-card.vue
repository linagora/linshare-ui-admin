<template>
  <div class="email-configuration-detail-card">
    <div class="email-configuration-detail-card__form">
      <a-form-item class="ls-form-title" :label="$t('EMAIL_TEMPLATES.EDIT_FORM.NAME_LABEL')">
        <a-input
          v-model:value="activeEmailConfigForm.name"
          :disabled="!editable || !editing"
          :placeholder="$t('EMAIL_TEMPLATES.EDIT_FORM.NAME_PLACEHOLDER')"
          class="ls-input"
        />
      </a-form-item>
      <a-form-item
        class="ls-form-title ls-form-switch"
        for="visible"
        :label="$t('EMAIL_TEMPLATES.EDIT_FORM.VISIBLE_LABEL')"
      >
        <a-switch v-model:checked="activeEmailConfigForm.visible" :disabled="!editable || !editing" class="ls-switch" />
      </a-form-item>
      <a-form-item class="ls-form-title" for="layout" :label="$t('EMAIL_TEMPLATES.EDIT_FORM.LAYOUT_LABEL')">
        <a-select
          v-model:value="activeEmailConfigForm.mailLayout"
          :disabled="!editable || !editing"
          class="ls-input"
          :placeholder="$t('EMAIL_TEMPLATES.EDIT_FORM.LAYOUT_PLACEHOLDER')"
          :bordered="false"
        >
          <a-select-option v-for="s in layoutOptions" :key="s?.label" :value="s?.value">
            {{ s?.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="ls-form-title" for="footer" :label="$t('EMAIL_TEMPLATES.EDIT_FORM.FOOTER_LABEL')">
        <div v-for="language in languageOptions" :key="language?.label" class="ls-form-footer-language">
          <a-select
            v-if="mailFooterLangsForm[language.value]"
            v-model:value="mailFooterLangsForm[language.value].mailFooter"
            :disabled="!editable || !editing"
            class="ls-input ls-select-field"
            :placeholder="$t('EMAIL_TEMPLATES.EDIT_FORM.FOOTER_PLACEHOLDER')"
            :bordered="false"
          >
            <a-select-option v-for="s in footerOptions" :key="s?.value" :value="s?.value">
              {{ s?.label }}
            </a-select-option>
          </a-select>
          <a-input :value="language.label" :disabled="true" class="ls-input ls-input-field" />
        </div>
      </a-form-item>
      <a-form-item class="ls-form-title" for="language" :label="$t('EMAIL_TEMPLATES.EDIT_FORM.LANGUAGE_LABEL')">
        <div class="ls-languages">
          <a-button
            v-for="language in languageOptions"
            :key="language?.label"
            class="select-language"
            :class="{ selected: activeEmailConfigForm.selectLanguage === language.value }"
            @click="onSelectLanguage(language.value)"
            >{{ language.label }}</a-button
          >
        </div>
      </a-form-item>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MailConfiguration } from '../../../types/MailConfiguration';
import { MailLayout } from '../../../types/MailLayout';
import { MailFooter } from '../../../types/MailFooter';
import useEmailTemplatesConfiguration from '../../../hooks/useEmailTemplatesConfiguration';

// composable
const { t } = useI18n();
const { activeEmailConfigForm, languageOptions, mailFooterLangsForm } = useEmailTemplatesConfiguration();

// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
  layouts?: MailLayout[];
  footers?: MailFooter[];
}>();
const emits = defineEmits(['update:modelValue', 'select-language']);

//computed
const layoutOptions = computed(() => {
  return (
    props.layouts?.map((item) => {
      return {
        label: item?.description,
        value: item?.uuid,
      };
    }) ?? []
  );
});

const footerOptions = computed(() => {
  return (
    props.footers?.map((item) => {
      return {
        label: item?.description,
        value: item?.uuid,
      };
    }) ?? []
  );
});
// methods
function onSelectLanguage(language: string) {
  activeEmailConfigForm.value.selectLanguage = language;
}
</script>
<style lang="less">
.email-configuration-detail-card {
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

  .select-language {
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

  .ls-form-footer-language {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .ls-form-footer-language .ls-input-field {
    width: 30%;
    min-width: 30%;
  }

  .ls-form-footer-language .ls-select-field {
    flex-grow: 1;
    flex-shrink: 1;
  }
}
</style>
