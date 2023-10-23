<template>
  <a-form>
    <a-form-item v-bind="validateInfos.name">
      <div class="input-container">
        <label>{{ $t('DOMAIN.FIELDS.NAME') }}</label>
        <a-input v-model:value="formState.name" :readonly="!isSuperAdmin" :disabled="!isSuperAdmin" />
      </div>
    </a-form-item>

    <a-form-item>
      <div class="input-container">
        <label>{{ $t('GENERAL.DESCRIPTION') }}</label>
        <a-textarea
          v-model:value="formState.description"
          :readonly="!isSuperAdmin"
          :disabled="!isSuperAdmin"
          auto-size
        />
      </div>
    </a-form-item>

    <a-form-item v-if="!isRootDomain">
      <div class="input-container">
        <label>{{ $t('DOMAIN.FIELDS.DEFAULT_USER_ROLE') }}</label>
        <a-select v-model:value="formState.defaultUserRole">
          <a-select-option value="SIMPLE">
            {{ $t('USERS.DETAIL_USER.ROLE_SIMPLE') }}
          </a-select-option>
          <a-select-option value="ADMIN">
            {{ $t('USERS.DETAIL_USER.ROLE_ADMIN') }}
          </a-select-option>
        </a-select>
        <small>{{ $t('DOMAIN.FIELDS.DEFAULT_USER_ROLE_HELPER') }}</small>
      </div>
    </a-form-item>

    <a-form-item v-if="!isRootDomain">
      <div class="input-container">
        <label>{{ $t('DOMAIN.FIELDS.NOTIFICATION_LANGUAGE') }}</label>
        <a-select v-model:value="formState.defaultEmailLanguage">
          <a-select-option v-for="option in languageOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </a-select-option>
        </a-select>
        <small>{{ $t('DOMAIN.FIELDS.NOTIFICATION_LANGUAGE_HELPER') }}</small>
      </div>
    </a-form-item>

    <div class="form-actions">
      <a-button class="reset" @click="reset">
        {{ $t('GENERAL.RESET') }}
      </a-button>

      <a-button type="primary" :loading="saving" @click="onSubmit">
        {{ $t('GENERAL.SAVE') }}
      </a-button>
    </div>
  </a-form>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { Form, message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import Domain from '@/modules/domain/types/Domain';
import { useAuthStore } from '@/modules/auth/store';
import { useDomainStore } from '@/modules/domain/store';
import { ACCOUNT_ROLE } from '@/modules/user/types/User';
import { defineComponent, ref, reactive, watchEffect, PropType, computed } from 'vue';

const useForm = Form.useForm;

export default defineComponent({
  name: 'DomainForm',
  props: {
    data: {
      default: () => ({}),
      type: Object as PropType<Domain>,
    },
  },
  setup(props) {
    const { t, locale } = useI18n();
    const domainStore = useDomainStore();
    const authStore = useAuthStore();
    const { isRootDomain } = storeToRefs(domainStore);
    const { loggedUserRole } = storeToRefs(authStore);
    const saving = ref(false);

    const formState = reactive<Omit<Domain, 'uuid'>>({
      name: props.data.name,
      description: props.data.description,
      defaultUserRole: props.data.defaultUserRole,
      defaultEmailLanguage: props.data.defaultEmailLanguage,
    });
    const formRules = reactive({
      name: [
        {
          required: true,
          message: t('DOMAIN.FIELDS.NAME_REQUIRED', locale.value),
        },
        {
          max: 255,
          message: t('DOMAIN.FIELDS.NAME_MAX_LENGTH', locale.value),
        },
      ],
    });
    const { validate, validateInfos } = useForm(formState, formRules);

    const isSuperAdmin = computed(() => {
      return loggedUserRole.value === ACCOUNT_ROLE.SUPERADMIN;
    });

    const languageOptions = computed(() => {
      return [
        { label: t(`LOCALE.ENGLISH`), value: 'ENGLISH' },
        { label: t(`LOCALE.FRENCH`), value: 'FRENCH' },
        { label: t(`LOCALE.RUSSIAN`), value: 'RUSSIAN' },
        { label: t(`LOCALE.VIETNAMESE`), value: 'VIETNAMESE' },
      ];
    });

    watchEffect(() => {
      if (props.data.uuid) {
        formState.name = props.data.name;
        formState.description = props.data.description;
        formState.defaultEmailLanguage = props.data.defaultEmailLanguage;
        formState.defaultUserRole = props.data.defaultUserRole;
      }
    });

    async function onSubmit() {
      saving.value = true;

      try {
        await validate();
      } catch (error) {
        saving.value = false;
        return;
      }

      try {
        await domainStore.updateDomain({
          ...props.data,
          ...formState,
        });

        message.success(t('MESSAGES.UPDATE_SUCCESS'));
      } catch (error) {
        message.error((error as APIError).getMessage());
      } finally {
        saving.value = false;
      }
    }

    function reset() {
      formState.name = props.data.name;
      formState.description = props.data.description;
      formState.defaultEmailLanguage = props.data.defaultEmailLanguage;
      formState.defaultUserRole = props.data.defaultUserRole;
    }

    return {
      reset,
      onSubmit,
      saving,
      formState,
      isRootDomain,
      isSuperAdmin,
      validateInfos,
      languageOptions,
    };
  },
});
</script>

<style lang="less" scoped>
.input-container {
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

.form-actions {
  .reset {
    margin-right: 10px;
  }
}
</style>
