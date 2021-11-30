<template>
  <a-form
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
  >
    <a-form-item
      :label="$t('REMOTE_SERVER.TYPE.TWAKE')"
      v-bind="validateInfos.serverUuid"
    >
      <a-select
        v-model:value="formState.serverUuid"
        :options="servers.options"
      />
    </a-form-item>

    <a-form-item
      :label="$t('USER_PROVIDER.TWAKE.COMPANY_ID')"
      :help="$t('USER_PROVIDER.TWAKE.COMPANY_ID_HELPER')"
      v-bind="validateInfos.companyId"
    >
      <a-input v-model:value="formState.companyId" />
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
import { computed, reactive, ref, ComputedRef } from 'vue';
import { Form, message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import RemoteServer from '@/modules/remote-server/types/RemoteServer';
import { TwakeUserProvider } from '../types/UserProvider';
import Domain from '../types/Domain';
import useNotification from '@/core/hooks/useNotification';

import {
  createUserProvider,
  deleteUserProvider,
  updateUserProvider
} from '../services/domain-api';

interface Props {
  domain: Domain;
  provider: TwakeUserProvider;
  serversList: RemoteServer[];
}

interface TwakeServerOptions {
  list: RemoteServer[];
  options: ComputedRef<{
    label: string;
    value: string;
  }[]>;
}

interface ProviderForm {
  serverUuid?: string;
  companyId?: string;
}

const useForm = Form.useForm;
const { t, locale } = useI18n();
const { confirmModal } = useNotification();

const emit = defineEmits(['cancel', 'submitted', 'deleted']);
const props = defineProps<Props>();
const servers = reactive<TwakeServerOptions>({
  list: props.serversList,
  options: computed(() => props.serversList.map(server => ({
    label: server.name,
    value: server.uuid
  })))
});

const formSubmitting = ref(false);
const formState = reactive<ProviderForm>({
  serverUuid: props.provider.twakeServer?.uuid,
  companyId: props.provider.twakeCompanyId
});
const formRules = reactive({
  companyId: [{ required: true, message: t('GENERAL.FIELD_REQUIRED', locale.value) }],
  serverUuid: [{ required: true, message: t('GENERAL.FIELD_REQUIRED', locale.value) }]
});

const { resetFields, validate, validateInfos } = useForm(formState, formRules);

async function create () {
  formSubmitting.value = true;

  try {
    await validate();
  } catch (error) {
    formSubmitting.value = false;
    return;
  }

  try {
    const provider = await createUserProvider(props.domain.uuid, getDto());

    emit('submitted', provider);
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    message.error(t('ERRORS.COMMON_MESSAGE'));
  } finally {
    formSubmitting.value = false;
  }
}

function getDto (): Partial<TwakeUserProvider> {
  return {
    type: props.provider.type,
    twakeCompanyId: formState.companyId,
    twakeServer: {
      uuid: formState.serverUuid || '',
      name: servers.list.find(server => server.uuid === formState.serverUuid)?.name || ''
    }
  };
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
      ...getDto()
    });

    emit('submitted', provider);
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    message.error(t('ERRORS.COMMON_MESSAGE'));
  } finally {
    formSubmitting.value = false;
  }
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
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
