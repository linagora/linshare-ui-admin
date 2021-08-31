<template>
  <PageTitle
    :title="'Domain details'"
    :subtitle="currentDomain.name"
    :breadcrumbs="breadcrumbs"
  >
    <template #subTitlePostfix>
      <div class="delete-domain-container">
        <a-button primary>{{ $t('DOMAIN.DELETE_DOMAIN') }}</a-button>
      </div>
    </template>
  </PageTitle>

  <div class="spinner" v-if="loadingDomain">
    <a-spin></a-spin>
  </div>

  <a-row :gutter="24" v-else>
    <a-col :span="12">
      <a-form :model="formState" ref="formRef">
        <div class="input-container">
          <label>{{ $t('DOMAIN.FIELDS.NAME') }}</label>
          <a-input v-model:value="formState.name"></a-input>
        </div>

        <div class="input-container">
          <label>{{ $t('DOMAIN.FIELDS.DESCRIPTION') }}</label>
          <a-input v-model:value="formState.description"></a-input>
        </div>

        <div class="input-container" v-if="!isRootDomain">
          <label>{{ $t('DOMAIN.FIELDS.DEFAULT_USER_ROLE') }}</label>
          <a-select v-model:value="formState.defaultUserRole">
            <a-select-option value="SIMPLE">
              {{ $t('USERS.DETAIL_USER.ROLE_SIMPLE') }}
            </a-select-option>
            <a-select-option value="ADMIN">
              {{ $t('USERS.DETAIL_USER.ROLE_ADMIN') }}
            </a-select-option>
            <a-select-option disabled value="SUPERADMIN">
              {{ $t('USERS.DETAIL_USER.ROLE_SUPERADMIN') }}
            </a-select-option>
          </a-select>
          <small>{{ $t('DOMAIN.FIELDS.DEFAULT_USER_ROLE_HELPER') }}</small>
        </div>

        <div class="input-container" v-if="!isRootDomain">
          <label>{{ $t('DOMAIN.FIELDS.NOTIFICATION_LANGUAGE') }}</label>
          <a-select v-model:value="formState.defaultEmailLanguage">
            <a-select-option value="ENGLISH">
              {{ $t('LOCALE.ENGLISH') }}
            </a-select-option>
            <a-select-option value="FRANCE">
              {{ $t('LOCALE.FRENCH') }}
            </a-select-option>
            <a-select-option value="RUSSIA">
              {{ $t('LOCALE.RUSSIAN') }}
            </a-select-option>
          </a-select>
          <small>{{ $t('DOMAIN.FIELDS.NOTIFICATION_LANGUAGE_HELPER') }}</small>
        </div>

        <div class="form-actions">
          <a-button class="reset">
            {{ $t('GENERAL.RESET') }}
          </a-button>

          <a-button type='primary' html-type='submit'>
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </a-form>
    </a-col>

    <a-col :span="10" :offset="2">
      <div class="info-block-container">
        <div class="info-block">
          <div class="title">{{ $t('GENERAL.CREATION_DATE') }}</div>
          <div class="value">
            {{ $d(currentDomain.creationDate, 'mediumDate') }}
          </div>
        </div>
        <div class="info-block">
          <div class="title">{{ $t('GENERAL.MODIFICATION_DATE') }}</div>
          <div class="value">
            {{ $d(currentDomain.modificationDate, 'mediumDate') }}
          </div>
        </div>
        <div class="info-block" v-if="!isRootDomain">
          <div class="title">{{ $t('DOMAIN.FIELDS.WELCOME_MESSAGE') }}</div>
          <div class="value">
            <a href="">{{ currentDomain.welcomeMessage.name }}</a>
          </div>
        </div>
        <div class="info-block" v-if="!isRootDomain">
          <div class="title">{{ $t('DOMAIN.FIELDS.MAIL_CONFIGURATION') }}</div>
          <div class="value">
            <a href="">{{ currentDomain.mailConfiguration.name }}</a>
          </div>
        </div>
        <div class="info-block" v-if="!isRootDomain">
          <div class="title">{{ $t('DOMAIN.FIELDS.MIME_POLICY') }}</div>
          <div class="value">
            <a href="">{{ currentDomain.mimePolicy.name }}</a>
          </div>
        </div>
        <div class="info-block" v-if="!isRootDomain">
          <div class="title">{{ $t('DOMAIN.FIELDS.DOMAIN_POLICY') }}</div>
          <div class="value">
            <a href="">{{ currentDomain.domainPolicy.name }}</a>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';
import PageTitle from '@/core/components/PageTitle.vue';
import Domain from '@/modules/domain/type/Domain';
import Status from '@/core/types/Status';

export default defineComponent({
  name: 'DomainDetails',
  components: {
    PageTitle
  },
  setup () {
    const store = useStore();
    const currentDomain = computed(() => store.getters['Domain/getCurrentDomain']);
    const loadingDomain = computed(() => store.getters['Domain/getStatus']('currentDomain') === Status.LOADING);
    const { breadcrumbs } = useBreadcrumbs();

    const formState = reactive< Omit<Domain, 'uuid'> >({
      name: '',
      description: ''
    });
    const formRef = ref();

    watchEffect(() => {
      if (currentDomain.value.uuid) {
        formState.name = currentDomain.value.name;
        formState.description = currentDomain.value.description;
        formState.defaultEmailLanguage = currentDomain.value.defaultEmailLanguage;
        formState.defaultUserRole = currentDomain.value.defaultUserRole;
      }
    });

    return {
      breadcrumbs,
      currentDomain,
      formRef,
      formState,
      loadingDomain,
      isRootDomain: computed(() => store.getters['Domain/isRootDomain'])
    };
  }
});
</script>

<style lang="less" scoped>
  .spinner {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-container {
    margin-bottom: 20px;

    label {
      display: inline-block;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .ant-select {
      width: 100%;
    }

    small {
      font-style: italic;
      color: @text-color-secondary;
    }
  }

  .info-block-container {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #F2F5F7;
    padding: 20px;
    border-radius: 4px;
    margin-top: 30px;

    .info-block {
      flex: 0 1 50%;
      margin: 20px 0;

      .title {
        color: @text-color-secondary;
      }
    }
  }

  .form-actions {
    .reset {
      margin-right: 10px;
    }
  }

  .delete-domain-container {
    .ant-btn {
      background: @primary-8;
      color: @text-color-inverse;
    }
  }
</style>
