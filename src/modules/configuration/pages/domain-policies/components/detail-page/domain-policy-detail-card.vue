<template>
  <a-form ref="formRef">
    <div class="domain-policy-detail-card">
      <div class="domain-policy-detail-card__form">
        <a-form-item class="ls-form-title" v-bind="validateInfos.label" :label="$t('DOMAIN_POLICY.CREATE_MODAL.NAME')">
          <a-input
            id="name"
            v-model:value="activeDomainPolicyForm.label"
            class="ls-input"
            :placeholder="$t('DOMAIN_POLICY.CREATE_MODAL.PLACEHOLDER_NAME')"
          ></a-input>
        </a-form-item>
        <a-form-item class="ls-form-title" :label="$t('DOMAIN_POLICY.CREATE_MODAL.DESCRIPTION')">
          <a-textarea
            id="name"
            v-model:value="activeDomainPolicyForm.description"
            class="ls-input"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          ></a-textarea>
        </a-form-item>
      </div>
      <div class="domain-policy-detail-card__date">
        <div class="info-block">
          <CalendarIcon class="system-icon"></CalendarIcon>
          <div>
            <div class="title">{{ $t('GENERAL.CREATION_DATE') }}</div>
            <div class="value">
              {{ $d(activeDomainPolicy?.creationDate ?? 0, 'mediumDate') }}
            </div>
          </div>
        </div>
        <div class="info-block">
          <CalendarIcon class="system-icon"></CalendarIcon>
          <div>
            <div class="title">{{ $t('GENERAL.MODIFICATION_DATE') }}</div>
            <div class="value">
              {{ $d(activeDomainPolicy?.modificationDate ?? 0, 'mediumDate') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, FormInstance } from 'ant-design-vue';
import useDomainPolicies from '../../hooks/useDomainPolicies';
import CalendarIcon from '@/core/components/icons/calendar-icon.vue';

// composable
const { t } = useI18n();
const { activeDomainPolicyForm, activeDomainPolicy } = useDomainPolicies();
const formRef = ref<FormInstance>();
const useForm = Form.useForm;

const formRules = computed(() => ({
  description: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  label: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(activeDomainPolicyForm, formRules);
// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const emits = defineEmits(['update:modelValue', 'select-language', 'refresh']);
</script>
<style lang="less">
.domain-policy-detail-card {
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
  &__date {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 32px;
    align-items: flex-start;
    gap: 28px;
    align-self: stretch;
    border-radius: 12px;
    margin-top: 24px;
    background: var(--neutral-colors-color-table-header, #fafafa);
    .info-block {
      margin-left: 10px;
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;
    }
    .info-block .title {
      color: var(--neutral-colors-color-text-secondary, #6d7885);
      /* Desktop/Body 2 - Regular */
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
      letter-spacing: -0.14px;
    }
    .info-block .value {
      color: var(--neutral-colors-color-text-primary, #343745);
      /* Desktop/Body 1 - Regular */
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 125% */
      letter-spacing: -0.32px;
    }

    .system-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      color: #6d7885;
    }
  }
}
</style>
