<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { message, Form } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { APIError } from '@/core/types/APIError';
import { useGuest } from '../hooks/useGuest';
import User, { ACCOUNT_ROLE } from '../types/User';
import { updateUser } from '../services/user-api';
import { getFunctionality } from '@/modules/configuration/pages/parameters/services/parameters-api';

interface FormModel {
  canCreateGuest: boolean;
  canUpload: boolean;
  expirationDate?: string;
  externalMailLocale: string;
  firstName: string;
  lastName: string;
  role: ACCOUNT_ROLE;
}

const props = defineProps<{ user: User }>();
const emit = defineEmits(['update']);
const { t, d } = useI18n();
const isGuestUser = computed(() => props.user.accountType === 'GUEST');
const guestFeatureEnabled = reactive({
  enable: false,
});
const { isValidExpirationDate, getMaxExpirationDate } = useGuest();
const formSubmitting = ref(false);
const formModel = reactive<FormModel>({
  firstName: props.user.firstName || '',
  lastName: props.user.lastName || '',
  role: props.user.role || ACCOUNT_ROLE.SIMPLE,
  externalMailLocale: props.user.externalMailLocale || '',
  canUpload: props.user.canUpload || false,
  canCreateGuest: props.user.canCreateGuest || false,
  expirationDate: props.user.expirationDate ? props.user.expirationDate.toString() : undefined,
});
const formRules = reactive({
  firstName: [{ required: true, message: t('GENERAL.FIELD_REQUIRED') }],
  lastName: [{ required: true, message: t('GENERAL.FIELD_REQUIRED') }],
  expirationDate: [
    {
      message: t('USERS.DETAIL_USER.GUEST_EXPIRATION_DATE_VALIDATION_MESSAGE', {
        date: d(getMaxExpirationDate(props.user), 'mediumDate'),
      }),
      validator: (_: any, value: string) =>
        isValidExpirationDate(props.user, new Date(value)) ? Promise.resolve() : Promise.reject(new Error()),
    },
  ],
});
const { validate, validateInfos } = Form.useForm(formModel, formRules);

const languageNotificationOptions = ['ENGLISH', 'FRENCH', 'RUSSIAN', 'VIETNAMESE'];

async function checkGuestFeature() {
  if (!isGuestUser.value) {
    try {
      guestFeatureEnabled.enable = await (
        await getFunctionality(props.user.domain.uuid, 'GUESTS')
      ).activationPolicy.enable.value;
    } catch (error) {
      if (error instanceof APIError) {
        return;
      }
    }
  }
}

async function update() {
  formSubmitting.value = true;

  try {
    await validate();
    const updated = await updateUser({
      ...props.user,
      ...formModel,
      expirationDate: Number(formModel.expirationDate),
    });
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
    emit('update', updated);
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  } finally {
    formSubmitting.value = false;
  }
}

checkGuestFeature();
</script>

<template>
  <a-row class="user-profile-row" justify="center" :gutter="[{ xs: 8, sm: 16, md: 24, lg: 32 }]">
    <a-col :xl="8" :lg="12" :md="24">
      <div class="info-block-container">
        <div class="info-block">
          <div class="info-block__title">
            {{ $t('USERS.DETAIL_USER.ACCOUNT_TYPE') }}
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
        <div v-if="isGuestUser" class="info-block">
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
            <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: user.domain.uuid } }">
              {{ user.domain.name }}
            </router-link>
          </div>
        </div>
      </div>
    </a-col>

    <a-col :xl="8" :lg="12" :md="24">
      <a-form @submit="update()">
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
          <a-select v-model:value="formModel.role">
            <a-select-option value="SIMPLE">
              {{ $t('USERS.DETAIL_USER.ROLE_SIMPLE') }}
            </a-select-option>
            <a-select-option value="ADMIN">
              {{ $t('USERS.DETAIL_USER.ROLE_ADMIN') }}
            </a-select-option>
          </a-select>
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.NOTIFICATION_LANGUAGE') }}</label>
          <a-select v-model:value="formModel.externalMailLocale">
            <a-select-option v-for="option in languageNotificationOptions" :key="option" :value="option">
              {{ $t(`LOCALE.${option}`) }}
            </a-select-option>
          </a-select>
        </div>
        <div v-if="isGuestUser" class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.EXPIRATION_DATE') }}</label>
          <a-form-item v-bind="validateInfos.expirationDate">
            <a-date-picker
              v-model:value="formModel.expirationDate"
              :disabled-date="(moment: any) => !isValidExpirationDate(props.user, moment.toDate())"
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
        <div v-if="user.accountType !== 'GUEST' && guestFeatureEnabled.enable" class="input-container">
          <a-checkbox v-model:checked="formModel.canCreateGuest">
            {{ $t('USERS.DETAIL_USER.ALLOW_GUEST_CREATION') }}
          </a-checkbox>
        </div>

        <div>
          <a-button type="primary" :loading="formSubmitting" html-type="submit">
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </a-form>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
.input-container {
  margin: 20px 0px;

  label {
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
  border: 1px solid @border-color-base;
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

@media (min-width: 992px) {
  .user-profile-row {
    flex-direction: row-reverse;
  }
}
</style>
