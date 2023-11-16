<template>
  <div class="technical-account-password">
    <a-form :model="changePassword">
      <div class="technical-account-password__form">
        <a-form-item class="ls-form-title" :label="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.RECENT_PASSWORD')">
          <a-input-password
            v-model:value="changePassword.oldPassword"
            :placeholder="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.PASSWORD')"
            class="ls-input"
          ></a-input-password>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          :label="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.NEW_PASSWORD')"
          :rules="[{ type: 'email' }]"
          :name="['mail']"
        >
          <a-input-password
            v-model:value="changePassword.newPassword"
            :placeholder="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.PASSWORD')"
            class="ls-input"
          ></a-input-password>
          <span :class="passwordStrengthClass"></span>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          :label="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.CONFIRM_PASSWORD')"
          :rules="[{ type: 'email' }]"
          :name="['mail']"
        >
          <a-input-password
            v-if="changePassword.newPassword === changePassword.confirmNewPassword"
            v-model:value="changePassword.confirmNewPassword"
            :placeholder="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.PASSWORD')"
            class="ls-input"
          ></a-input-password>
          <a-input-password
            v-else
            v-model:value="changePassword.confirmNewPassword"
            :placeholder="$t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.PASSWORD')"
            class="ls-input-red"
          ></a-input-password>
        </a-form-item>
      </div>
    </a-form>
    <div class="system-informations">
      <h3 class="section-title">{{ $t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.PASSWORD_RULES') }}</h3>
      <div class="info-block">
        <ul>
          <li>{{ $t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.FIRST_RULE') }}</li>
          <li>{{ $t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.SECOND_RULE') }}</li>
          <li>{{ $t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.THIRD_RULE') }}</li>
          <li>{{ $t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.FOURTH_RULE') }}</li>
        </ul>
      </div>
    </div>
    <div class="technical-account-password__actions">
      <a-button
        :disabled="changePassword.newPassword !== changePassword.confirmNewPassword || loading"
        type="primary"
        class="save-button"
        @click="changeTechnicalPassword"
      >
        <a-spin v-if="loading"></a-spin>
        <span v-else>{{ $t('TECHNICAL_ACCOUNTS.PASSWORD_TAB.SAVE_PASSWORD') }}</span>
      </a-button>
      <a-button class="ls-button ls-cancel" @click="resetPasswordField">
        {{ $t('GENERAL.CANCEL') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch } from 'vue';
import useTechnicalAccount from '../../hooks/useTechnicalAccount';
import { changeTechnicalAccountPassword } from '../../services/technical-account-api';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';

// props
const emits = defineEmits(['refresh', 'close']);
// composable
const router = useRouter();
const { changePassword, loading, passwordStrengthClass, passwordToEvaluate } = useTechnicalAccount();
const { t } = useI18n();

async function changeTechnicalPassword() {
  try {
    loading.value = true;
    const uuid = router.currentRoute.value.params.id;
    const payload = {
      oldPwd: changePassword.oldPassword,
      newPwd: changePassword.newPassword,
    };
    await changeTechnicalAccountPassword(uuid, payload);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  } finally {
    loading.value = false;
  }
}
function resetPasswordField() {
  changePassword.oldPassword = '';
  changePassword.newPassword = '';
  changePassword.confirmNewPassword = '';
}

watch(
  () => changePassword.newPassword,
  (newPassword) => {
    passwordToEvaluate(newPassword);
  }
);
</script>
<style lang="less">
.technical-account-password {
  width: 30%;

  .title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 50px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 50%;
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

  .red {
    color: #eb0707;
  }

  .blue {
    color: #007aff;
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

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
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

  .ant-col {
    min-height: unset;
  }
  .account-status {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    &__title {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      color: #434657;
      gap: 16px;
    }
  }
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

.system-informations {
  border-radius: 12px;
  background-color: #fafafa;
  padding: 16px;
}

.info-block {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  color: #6d7885;
}

.section-title {
  color: #434657;
}

.save-button {
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 24px;
  height: 48px;
  display: flex;
  text-align: center;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-left: 5px;
}
</style>
