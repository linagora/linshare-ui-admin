<template>
  <a-form
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
  >
    <a-form-item
      :label="$t('USER_PROVIDER.OIDC.ASSOCIATED_DOMAIN_ID')"
      :extra="$t('USER_PROVIDER.OIDC.ASSOCIATED_DOMAIN_ID_HELPER', { name: domain.name })"
      v-bind="validateInfos.domainDiscriminator"
    >
      <a-input
        v-model:value="formState.domainDiscriminator"
        @change="unique = true"
      />
    </a-form-item>

    <div class="form-actions">
      <div>
        <a-button
          v-if="provider.uuid"
          @click="resetFields"
        >
          {{ $t('GENERAL.RESET') }}
        </a-button>

        <a-button
          v-else
          @click="$emit('cancel')"
        >
          {{ $t('GENERAL.CANCEL') }}
        </a-button>

        <a-button
          type="primary"
          style="margin-left: 10px;"
          :loading="formSubmitting"
          @click="provider.uuid ? save() : create()"
        >
          {{ $t('GENERAL.SAVE') }}
        </a-button>
      </div>

      <a-button
        v-if="provider.uuid"
        type="primary"
        danger
        @click="confirmDelete"
      >
        {{ $t('GENERAL.DELETE') }}
      </a-button>
    </div>
  </a-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { message, Form } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

import Domain from '../type/Domain';
import { OIDCUserProvider } from '../type/UserProvider';
import useNotification from '@/core/hooks/useNotification';
import { APIError } from '@/core/types/APIError';

import {
  createUserProvider,
  deleteUserProvider,
  updateUserProvider
} from '../services/domain-api';

interface Props {
  provider: OIDCUserProvider
  domain: Domain
}

const unique = ref(true);
const props = defineProps<Props>();
const emit = defineEmits(['cancel', 'deleted', 'submitted']);
const useForm = Form.useForm;
const { t } = useI18n();
const { confirmModal } = useNotification();
const formSubmitting = ref(false);
const formState = reactive<Partial<OIDCUserProvider>>({
  domainDiscriminator: props.provider.domainDiscriminator
});
const formRules = reactive(({
  domainDiscriminator: [{
    required: true,
    message: t('GENERAL.FIELD_REQUIRED')
  }, {
    message: t('USER_PROVIDER.OIDC.USED_DOMAIN_ID'),
    validator: () => unique.value ? Promise.resolve() : Promise.reject(new Error())
  }]
}));
const { validate, validateInfos, resetFields } = useForm(formState, formRules);

async function create () {
  formSubmitting.value = true;

  try {
    await validate();
  } catch (_) {
    formSubmitting.value = false;
    return;
  }

  try {
    const provider = await createUserProvider(props.domain.uuid, {
      type: 'OIDC_PROVIDER',
      domainDiscriminator: formState.domainDiscriminator
    });

    emit('submitted', provider);
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      handleSubmitError(error);
    }

    console.warn(error);
  } finally {
    formSubmitting.value = false;
  }
}

async function save () {
  formSubmitting.value = true;

  try {
    await validate();
  } catch (error) {
    formSubmitting.value = false;
    return;
  }

  try {
    const provider = await updateUserProvider(props.domain.uuid, {
      ...props.provider,
      domainDiscriminator: formState.domainDiscriminator
    });

    emit('submitted', provider);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      handleSubmitError(error);
    }

    console.warn(error);
  } finally {
    formSubmitting.value = false;
  }
}

function handleSubmitError (error: APIError) {
  unique.value = error.errorCode === '38100';
  validate();
  message.error(error.getMessage());
}

async function remove () {
  try {
    await deleteUserProvider(props.domain.uuid, props.provider);

    message.success(t('MESSAGES.DELETE_SUCCESS'));
    emit('deleted');
  } catch (error) {
    message.error(t('MESSAGES.DELETE_FAILURE'));
  }
}

function confirmDelete () {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('USER_PROVIDER.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: remove
  });
}
</script>

<style lang='less' scoped>
.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
