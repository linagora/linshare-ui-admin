<template>
  <a-form ref="formRef">
    <a-card flat :bordered="false" class="create-technical-account-card">
      <div class="create-technical-account-card__title">{{ $t('TECHNICAL_ACCOUNTS.CREATE_MODAL.TITLE') }}</div>
      <div class="create-technical-account-card__form">
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.name"
          :label="$t('TECHNICAL_ACCOUNTS.CREATE_MODAL.NAME')"
        >
          <a-input id="name" v-model:value="creationForm.name" class="ls-input"></a-input>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.mail"
          :label="$t('TECHNICAL_ACCOUNTS.CREATE_MODAL.MAIL')"
        >
          <a-input v-model:value="creationForm.mail" class="ls-input"></a-input>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.role"
          :label="$t('TECHNICAL_ACCOUNTS.CREATE_MODAL.ROLE')"
        >
          <a-select v-model:value="creationForm.role">
            <a-select-option value="DELEGATION">{{ $t('TECHNICAL_ACCOUNTS.CREATE_MODAL.DELEGATION') }}</a-select-option>
            <a-select-option value="UPLOAD_PROPOSITION">
              {{ $t('TECHNICAL_ACCOUNTS.CREATE_MODAL.UPLOAD_PROPOSITION') }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.password"
          :label="$t('TECHNICAL_ACCOUNTS.CREATE_MODAL.NEW_PASSWORD')"
        >
          <a-input-password v-model:value="creationForm.password" class="ls-input"></a-input-password>
          <span :class="passwordStrengthClass"></span>
          <span class="password-requierement"> {{ $t('TECHNICAL_ACCOUNTS.CREATE_MODAL.PASSWORD_REQUIREMENT') }}</span>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.password_confirmation"
          :label="$t('TECHNICAL_ACCOUNTS.CREATE_MODAL.NEW_PASSWORD_CONFIRM')"
        >
          <a-input-password
            v-if="creationForm.password === creationForm.password_confirmation"
            v-model:value="creationForm.password_confirmation"
            class="ls-input"
          ></a-input-password>
          <a-input-password
            v-else
            v-model:value="creationForm.password_confirmation"
            class="ls-input-red"
          ></a-input-password>
        </a-form-item>
        <a-form-item class="ls-form-title">
          <a-checkbox v-model:checked="creationForm.enable">{{
            $t('TECHNICAL_ACCOUNTS.CREATE_MODAL.STATUS')
          }}</a-checkbox>
        </a-form-item>
      </div>
      <div class="create-technical-account-card__actions">
        <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
        <a-button
          :disabled="strength < 100 || creationForm.password !== creationForm.password_confirmation"
          class="ls-button ls-save"
          type="primary"
          @click="onCreateTechnicalAccount"
        >
          <a-spin v-if="loading" />
          <span v-else>{{ $t('GENERAL.CREATE') }}</span>
        </a-button>
      </div>
    </a-card>
  </a-form>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import useTechnicalAccount from '../hooks/useTechnicalAccount';
import { Form, FormInstance } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

// props
const emits = defineEmits(['refresh', 'close']);
// composable
const { t } = useI18n();
const useForm = Form.useForm;
const { loading, handleCreateTechnicalAccount, creationForm, passwordStrengthClass, strength, passwordToEvaluate } =
  useTechnicalAccount();

const formRef = ref<FormInstance>();

const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
  mail: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
  role: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
  password_confirmation: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(creationForm, formRules);
// methods
function resetFormData() {
  resetFields();
}
async function onCreateTechnicalAccount() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  const payload = {
    enable: creationForm.enable,
    mail: creationForm.mail,
    name: creationForm.name,
    password: creationForm.password,
    role: creationForm.role,
  };
  const result = await handleCreateTechnicalAccount(payload);
  if (result) {
    emits('refresh');
    onCloseModal();
  }
}

async function onCloseModal() {
  resetFormData();
  emits('close');
}

watch(
  () => creationForm.password,
  (newPassword) => {
    passwordToEvaluate(newPassword);
  }
);
</script>

<style lang="less">
.create-technical-account-card {
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border-radius: 12px;
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

  .ls-input-red {
    height: 44px;
    background: #fff;
    border: 1px solid #eb0707;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    &:hover {
      border: 1px solid #eb0707;
    }
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

.password-requierement {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.password-strength-low {
  display: block;
  width: 80%;
  transition: background-color 0.2s;
  background-color: rgba(231, 6, 6, 0.911);
  border-radius: 12px;
  height: 6px;
  margin-top: 10px;
  margin-left: 10%;
}

.password-strength-medium {
  display: block;
  height: 2px;
  width: 80%;
  transition: background-color 0.2s;
  margin-top: 5px;
  background-color: rgb(255, 139, 6);
  border-radius: 12px;
  height: 6px;
  margin-top: 10px;
  margin-left: 10%;
}

.password-strength-high {
  display: block;
  height: 2px;
  width: 80%;
  transition: background-color 0.2s;
  margin-top: 5px;
  background-color: rgb(12, 228, 217);
  border-radius: 12px;
  height: 6px;
  margin-top: 10px;
  margin-left: 10%;
}
</style>
