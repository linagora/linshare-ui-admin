<script lang='ts' setup>
import { computed, reactive, ref } from 'vue';
import { message, Form } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { APIError } from '@/core/types/APIError';
import { useGuest } from '../hooks/useGuest';
import User, { ACCOUNT_ROLE } from '../types/User';
import { isEnable } from '@/core/utils/functionality';

interface FormModel {
  firstName: string;
  lastName: string;
  role: ACCOUNT_ROLE;
  externalMailLocale: string;
  canUpload: boolean;
  canCreateGuest: boolean;
  expirationDate?: string;
}

const store = useStore();
const { t, d } = useI18n();
const user = computed<User>(() => store.getters['User/getUser']);
const guestFeatureEnabled = computed(() => {
  const functionality = store.getters['Domain/getLoggedUserFunctionality']('GUESTS');

  return isEnable(functionality);
});

const {
  isCurrentUserGuest,
  maxExpirationDate,
  isValidExpirationDate
} = useGuest();
const formSubmitting = ref(false);
const formModel = reactive<FormModel>({
  firstName: user.value.firstName,
  lastName: user.value.lastName,
  role: user.value.role,
  externalMailLocale: user.value.externalMailLocale,
  canUpload: user.value.canUpload,
  canCreateGuest: user.value.canCreateGuest,
  expirationDate: user.value.expirationDate ? user.value.expirationDate.toString() : undefined
});
const formRules = reactive({
  firstName: [{ required: true, message: t('GENERAL.FIELD_REQUIRED') }],
  lastName: [{ required: true, message: t('GENERAL.FIELD_REQUIRED') }],
  expirationDate: [{
    message: isCurrentUserGuest.value
      ? t('USERS.DETAIL_USER.GUEST_EXPIRATION_DATE_VALIDATION_MESSAGE', {
        date: d(maxExpirationDate.value, 'mediumDate')
      })
      : '',
    validator: (rule: Record<string, unknown>, value: string) => isValidExpirationDate(Number(value))
      ? Promise.resolve()
      : Promise.reject(new Error())
  }]
});

const { validate, validateInfos } = Form.useForm(formModel, formRules);

async function updateUser () {
  formSubmitting.value = true;

  try {
    await validate();
    await store.dispatch('User/updateUser', {
      ...user.value,
      ...formModel,
      expirationDate: Number(formModel.expirationDate)
    });
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  } finally {
    formSubmitting.value = false;
  }
}
</script>

<template>
  <a-row class="user-profile-row">
    <a-col :xl="{span: 9, offset: 2}">
      <a-form @submit="updateUser()">
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.FIRST_NAME') }}</label>
          <a-input v-model:value="formModel.firstName" />
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.LAST_NAME') }}</label>
          <a-input v-model:value="formModel.lastName" />
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.ROLE') }}</label>
          <a-select
            v-model:value="formModel.role"
            :disabled="user.role === 'SUPERADMIN'"
          >
            <a-select-option value="SIMPLE">
              {{ $t('USERS.DETAIL_USER.ROLE_SIMPLE') }}
            </a-select-option>
            <a-select-option value="ADMIN">
              {{ $t('USERS.DETAIL_USER.ROLE_ADMIN') }}
            </a-select-option>
            <a-select-option
              disabled
              value="SUPERADMIN"
            >
              {{ $t('USERS.DETAIL_USER.ROLE_SUPERADMIN') }}
            </a-select-option>
          </a-select>
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.NOTIFICATION_LANGUAGE') }}</label>
          <a-select v-model:value="formModel.externalMailLocale">
            <a-select-option value="ENGLISH">
              {{ $t('LOCALE.ENGLISH') }}
            </a-select-option>
            <a-select-option value="FRENCH">
              {{ $t('LOCALE.FRENCH') }}
            </a-select-option>
          </a-select>
        </div>
        <div
          v-if="isCurrentUserGuest"
          class="input-container"
        >
          <label>{{ $t('USERS.DETAIL_USER.EXPIRATION_DATE') }}</label>
          <a-form-item v-bind="validateInfos.expirationDate">
            <a-date-picker
              v-model:value="formModel.expirationDate"
              :disabled-date="(moment: any) => !isValidExpirationDate(moment.toDate())"
              style="width: 100%"
              value-format="x"
              format="MMM DD, YYYY"
            />
          </a-form-item>
        </div>
        <div class="input-container">
          <a-checkbox v-model:checked="formModel.canUpload">
            {{ $t('USERS.DETAIL_USER.ENABLE_PERSONAL_SPACE') }}
          </a-checkbox>
        </div>
        <div
          v-if="!isCurrentUserGuest && guestFeatureEnabled "
          class="input-container"
        >
          <a-checkbox v-model:checked="formModel.canCreateGuest">
            {{ $t('USERS.DETAIL_USER.ALLOW_GUEST_CREATION') }}
          </a-checkbox>
        </div>

        <div>
          <a-button
            type="primary"
            :loading="formSubmitting"
            html-type="submit"
          >
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </a-form>
    </a-col>

    <a-col :xl="{span: 9, offset: 2}">
      <div class="info-block-container">
        <div class="info-block">
          <div class="info-block__title">
            {{ $t("USERS.DETAIL_USER.ACCOUNT_TYPE") }}
          </div>
          <div class="info-block__value">
            {{ user.accountType }}
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__title">
            {{ $t('USERS.DETAIL_USER.CREATION_DATE') }}
          </div>
          <div class="info-block__value">
            {{ $d(user.creationDate, 'mediumDateTime') }}
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__title">
            {{ $t('USERS.DETAIL_USER.MODIFICATION_DATE') }}
          </div>
          <div class="info-block__value">
            {{ $d(user.modificationDate, 'mediumDateTime') }}
          </div>
        </div>
        <div
          v-if="isCurrentUserGuest"
          class="info-block"
        >
          <div class="info-block__title">
            {{ $t('USERS.DETAIL_USER.AUTHOR') }}
          </div>
          <div class="info-block__value">
            {{ user.author && user.author.name }}
          </div>
        </div>
        <div class="info-block">
          <div class="info-block__title">
            {{ $t('USERS.DETAIL_USER.DOMAIN') }}
          </div>
          <div class="info-block__value">
            {{ user.domain && user.domain.name }}
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>

  .input-container {
    margin: 20px 0px;

    label {
      display: inline-block;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .ant-select {
      width: 100%;
    }
  }

  .info-block-container {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #F2F5F7;
    padding: 20px;
    margin-top: 20px;
    border-radius: 4px;

    .info-block {
      padding: 5px;
      margin-bottom: 20px;
      width: 50%;

      @media (max-width: 575px) {
        width: 100%;
      }

      &__title {
        color: @text-color-secondary;
      }
    }
  }

  @media (max-width: 1068px) {
    .user-profile-row {
      flex-direction: column-reverse;
    }
  };
</style>
