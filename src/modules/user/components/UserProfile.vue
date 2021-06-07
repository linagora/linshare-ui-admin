<template>
  <a-row class='user-profile-row'>
    <a-col :xl="{span: 9, offset: 2}">
      <a-form :model="form" @submit="updateUser()">
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.FIRST_NAME') }}</label>
          <a-input v-model:value="form.firstName"></a-input>
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.LAST_NAME')}}</label>
          <a-input v-model:value="form.lastName"></a-input>
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.ROLE') }}</label>
          <a-select v-model:value="form.role">
            <a-select-option value="SIMPLE">
              SIMPLE
            </a-select-option>
            <a-select-option value="ADMIN">
              ADMIN
            </a-select-option>
          </a-select>
        </div>
        <div class="input-container">
          <label>{{ $t('USERS.DETAIL_USER.NOTIFICATION_LANGUAGE') }}</label>
          <a-select v-model:value="form.externalMailLocale">
            <a-select-option value="ENGLISH">
              {{ $t('LOCALE.ENGLISH') }}
            </a-select-option>
            <a-select-option value="FRENCH">
              {{ $t('LOCALE.FRENCH') }}
            </a-select-option>
          </a-select>
        </div>
        <div class="input-container" v-if="user.accountType === 'GUEST'">
          <label>{{ $t('USERS.DETAIL_USER.EXPIRATION_DATE') }}</label>
          <a-date-picker style="width: 100%" v-model:value="form.expirationDate" valueFormat="x" format="MMM DD, YYYY"/>
        </div>
        <div class="input-container">
          <a-checkbox v-model:checked="form.canUpload">
            {{ $t('USERS.DETAIL_USER.ENABLE_PERSONAL_SPACE')}}
          </a-checkbox>
        </div>
        <div class="input-container" v-if="user.accountType !== 'GUEST'">
          <a-checkbox v-model:checked="form.canCreateGuest">
            {{ $t('USERS.DETAIL_USER.ALLOW_GUEST_CREATION') }}
          </a-checkbox>
        </div>
        <div>
          <a-button type='primary' html-type='submit'>
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </a-form>
    </a-col>

    <a-col :xl="{span: 9, offset: 2}">
      <div class="info-block-container">
        <div class="info-block">
          <div class="info-block__title">{{ $t("USERS.DETAIL_USER.ACCOUNT_TYPE")}}</div>
          <div class="info-block__value">{{ user.accountType }}</div>
        </div>
        <div class="info-block">
          <div class="info-block__title">{{ $t('USERS.DETAIL_USER.CREATION_DATE')}}</div>
          <div class="info-block__value">{{ $d(user.creationDate, 'mediumDateTime') }}</div>
        </div>
        <div class="info-block">
          <div class="info-block__title">{{ $t('USERS.DETAIL_USER.MODIFICATION_DATE') }}</div>
          <div class="info-block__value">{{ $d(user.modificationDate, 'mediumDateTime') }}</div>
        </div>
        <div class="info-block" v-if="user.accountType === 'GUEST'">
          <div class="info-block__title">{{ $t('USERS.DETAIL_USER.AUTHOR') }}</div>
          <div class="info-block__value">{{ user.author && user.author.name }}</div>
        </div>
        <div class="info-block">
          <div class="info-block__title">{{ $t('USERS.DETAIL_USER.DOMAIN') }}</div>
          <div class="info-block__value">{{ user.domain && user.domain.name }}</div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import store from '@/core/store';
import User from '../type/User';

export default defineComponent({
  name: 'UserProfile',
  async setup () {
    const user = computed<User>(() => store.getters['User/getUser']);
    const { t } = useI18n();
    const form = reactive({
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      role: user.value.role,
      externalMailLocale: user.value.externalMailLocale,
      canUpload: user.value.canUpload,
      canCreateGuest: user.value.canCreateGuest,
      expirationDate: user.value.expirationDate ? user.value.expirationDate.toString() : null
    });

    async function updateUser () {
      try {
        await store.dispatch('User/updateUser', {
          ...user.value,
          ...form,
          expirationDate: Number(form.expirationDate)
        });
        message.success(t('MESSAGES.UPDATE_SUCCESS'));
      } catch (error) {
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      }
    }

    return {
      form,
      user,
      updateUser
    };
  }
});
</script>

<style lang="less" scoped>
  .input-container {
    margin: 20px 0px;

    label {
      display: inline-block;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
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
        color: #999;
      }

      &__value {
        color: #333;
      }
    }
  }

  @media (max-width: 1068px) {
    .user-profile-row {
      flex-direction: column-reverse;
    }
  };
</style>
