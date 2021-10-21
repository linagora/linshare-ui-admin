<template>
  <a-form
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
  >
    <a-form-item
      :label="$t('REMOTE_SERVER.TYPE.LDAP')"
      v-bind="validateInfos.serverUuid"
    >
      <a-select
        v-model:value="formState.serverUuid"
        :options="servers.options"
      />
    </a-form-item>

    <a-form-item
      :label="$t('USER_FILTER.TYPES.LDAP')"
      v-bind="validateInfos.filterUuid"
    >
      <a-select
        v-model:value="formState.filterUuid"
        :options="filters.options"
      />
    </a-form-item>

    <a-form-item
      :label="$t('USER_PROVIDER.LDAP.BASE_DN')"
      :help="$t('USER_PROVIDER.LDAP.BASE_DN_HELPER')"
      v-bind="validateInfos.baseDn"
    >
      <a-input v-model:value="formState.baseDn" />
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
import UserFilter from '@/modules/user-filter/types/UserFilter';
import LDAPUserProvider from '../type/LDAPUserProvider';
import DomainAPIClient from '../services/DomainAPIClient';
import Domain from '../type/Domain';
import useNotification from '@/core/hooks/useNotification';

interface Props {
  domain: Domain;
  provider: LDAPUserProvider;
  serversList: RemoteServer[];
  filtersList: UserFilter[];
}

interface LDAPServerOptions {
  list: RemoteServer[];
  options: ComputedRef<{
    label: string;
    value: string;
  }[]>;
}

interface LDAPFilterOptions {
  list: UserFilter[];
  options: ComputedRef<{
    label: string;
    value: string;
  }[]>;
}

interface ProviderForm {
  baseDn?: string;
  serverUuid?: string;
  filterUuid?: string;
}

const useForm = Form.useForm;
const { t, locale } = useI18n();
const { confirmModal } = useNotification();

const emit = defineEmits(['cancel', 'submitted', 'deleted']);
const props = defineProps<Props>();
const formSubmitting = ref(false);
const formState = reactive<ProviderForm>({
  baseDn: props.provider.baseDn,
  serverUuid: props.provider.ldapServer?.uuid,
  filterUuid: props.provider.userFilter?.uuid
});
const formRules = reactive({
  baseDn: [{ required: true, message: t('GENERAL.FIELD_REQUIRED', locale.value) }],
  serverUuid: [{ required: true, message: t('GENERAL.FIELD_REQUIRED', locale.value) }],
  filterUuid: [{ required: true, message: t('GENERAL.FIELD_REQUIRED', locale.value) }]
});

const { resetFields, validate, validateInfos } = useForm(formState, formRules);

const servers = reactive<LDAPServerOptions>({
  list: props.serversList,
  options: computed(() => props.serversList.map(server => ({
    label: server.name,
    value: server.uuid
  })))
});
const filters = reactive<LDAPFilterOptions>({
  list: props.filtersList,
  options: computed(() => props.filtersList.map(filter => ({
    label: filter.name,
    value: filter.uuid
  })))
});

async function create () {
  formSubmitting.value = true;

  try {
    await validate();
  } catch (error) {
    formSubmitting.value = false;
    return;
  }

  try {
    const provider = await DomainAPIClient.createUserProvider(props.domain.uuid, getDto());

    emit('submitted', provider);
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    message.error(t('ERRORS.COMMON_MESSAGE'));
  } finally {
    formSubmitting.value = false;
  }
}

function getDto (): Partial<LDAPUserProvider> {
  return {
    type: 'LDAP_PROVIDER',
    baseDn: formState.baseDn,
    ldapServer: {
      uuid: formState.serverUuid || '',
      name: servers.list.find(server => server.uuid === formState.serverUuid)?.name || ''
    },
    userFilter: {
      uuid: formState.filterUuid || '',
      name: filters.list.find(filter => filter.uuid === formState.filterUuid)?.name || ''
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
    const provider = await DomainAPIClient.updateUserProvider(props.domain.uuid, {
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
    await DomainAPIClient.deleteUserProvider(props.domain.uuid, props.provider);

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
