<template>
  <PageTitle :title="$t('PASSWORD.TITLE')"></PageTitle>

  <a-form ref="formRef" class="ant-row">
    <a-card flat :bordered="false" class="ant-col ant-col-12 change-password-card">
      <div class="change-password-card__form">
        <a-form-item class="ls-form-title" v-bind="validateInfos.old_password" :label="$t('PASSWORD.OLD_PASSWORD')">
          <a-input-password
            v-model:value="creationForm.old_password"
            class="ls-input"
            maxlength="30"
          ></a-input-password>
        </a-form-item>
        <a-form-item class="ls-form-title" v-bind="validateInfos.new_password" :label="$t('PASSWORD.NEW_PASSWORD')">
          <a-input-password
            v-model:value="creationForm.new_password"
            class="ls-input"
            maxlength="30"
          ></a-input-password>
          <span :class="passwordStrengthClass"></span>
          <span class="password-requierement"> {{ $t('PASSWORD.PASSWORD_REQUIREMENT') }}</span>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          v-bind="validateInfos.password_confirmation"
          :label="$t('PASSWORD.NEW_PASSWORD_CONFIRM')"
        >
          <a-input-password
            v-if="creationForm.new_password === creationForm.password_confirmation"
            v-model:value="creationForm.password_confirmation"
            class="ls-input"
            maxlength="30"
          ></a-input-password>
          <a-input-password
            v-else
            v-model:value="creationForm.password_confirmation"
            class="ls-input-red"
            maxlength="30"
          ></a-input-password>
        </a-form-item>
      </div>
      <div class="change-password-card__actions">
        <router-link v-slot="{ href, navigate }" to="/">
          <a-button class="ls-button ls-cancel" type="primary" :href="href" @click="navigate">
            {{ $t('GENERAL.CANCEL') }}
          </a-button>
        </router-link>
        <a-button
          :disabled="strength < 100 || creationForm.new_password !== creationForm.password_confirmation"
          class="ls-button ls-save"
          type="primary"
          @click="onChangePassword"
        >
          <a-spin v-if="loading" />
          <span v-else>{{ $t('GENERAL.SAVE') }}</span>
        </a-button>
      </div>
    </a-card>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/modules/auth/store';
import PageTitle from '@/core/components/page-title.vue';
import { Form, FormInstance } from 'ant-design-vue';
import useChangePassword from '@/modules/auth/hooks/useChangePassword';

const authStore = useAuthStore();
const { t } = useI18n();
const useForm = Form.useForm;
const formRef = ref<FormInstance>();
const { loading, handleChangePassword, creationForm, passwordStrengthClass, strength, passwordToEvaluate } =
  useChangePassword();

const formRules = computed(() => ({
  old_password: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
      trigger: 'blur',
    },
  ],
  new_password: [
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

async function onChangePassword() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  const payload = {
    oldPwd: creationForm.old_password,
    newPwd: creationForm.new_password,
  };
  await handleChangePassword(payload);
  resetFormData();
}

watch(
  () => creationForm.new_password,
  (newPassword) => {
    passwordToEvaluate(newPassword);
  }
);

onUnmounted(() => {
  resetFormData();
});
</script>

<style lang="less">
.change-password-card {
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

    .ls-button,
    .router-link-active {
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
    justify-content: center;
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

.ant-row {
  justify-content: center;
}
</style>
