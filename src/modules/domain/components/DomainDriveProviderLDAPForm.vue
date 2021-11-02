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
      :label="$t('DRIVE_PROVIDER.LDAP.BASE_DN')"
      :help="$t('DRIVE_PROVIDER.LDAP.BASE_DN_HELPER')"
      v-bind="validateInfos.baseDn"
    >
      <a-input v-model:value="formState.baseDn" />
    </a-form-item>

    <a-form-item>
      <a-checkbox v-model:checked="formState.searchInOtherDomains">
        {{ $t('DRIVE_PROVIDER.LDAP.SEARCH_IN_OTHER_DOMAINS') }}
      </a-checkbox>
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
import { LDAPDriveFilter } from '@/modules/drive-filter/types/DriveFilters';
import { LDAPDriveProvider } from '../types/DriveProvider';
import Domain from '../types/Domain';
import useNotification from '@/core/hooks/useNotification';

import {
  createDriveProvider,
  deleteDriveProvider,
  updateDriveProvider
} from '../services/domain-api';

interface Props {
  domain: Domain;
  provider: LDAPDriveProvider;
  serversList: RemoteServer[];
  filtersList: LDAPDriveFilter[];
}

interface LDAPServerOptions {
  list: RemoteServer[];
  options: ComputedRef<{
    label: string;
    value: string;
  }[]>;
}

interface LDAPFilterOptions {
  list: LDAPDriveFilter[];
  options: ComputedRef<{
    label: string;
    value: string;
  }[]>;
}

interface ProviderForm {
  baseDn: string;
  serverUuid: string;
  filterUuid: string;
  searchInOtherDomains: boolean;
}

const useForm = Form.useForm;
const { t, locale } = useI18n();
const { confirmModal } = useNotification();

const emit = defineEmits(['cancel', 'submitted', 'deleted']);
const props = defineProps<Props>();
const formSubmitting = ref(false);
const formState = reactive<ProviderForm>({
  baseDn: props.provider.baseDn || '',
  serverUuid: props.provider.ldapServer?.uuid || '',
  filterUuid: props.provider.driveFilter?.uuid || '',
  searchInOtherDomains: props.provider.searchInOtherDomains
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
    const provider = await createDriveProvider(props.domain.uuid, getDto());

    emit('submitted', provider);
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    message.error(t('ERRORS.COMMON_MESSAGE'));
  } finally {
    formSubmitting.value = false;
  }
}

function getDto (): LDAPDriveProvider {
  return {
    type: 'LDAP_PROVIDER',
    baseDn: formState.baseDn,
    ldapServer: {
      uuid: formState.serverUuid || '',
      name: servers.list.find(server => server.uuid === formState.serverUuid)?.name || ''
    },
    driveFilter: {
      uuid: formState.filterUuid || '',
      name: filters.list.find(filter => filter.uuid === formState.filterUuid)?.name || ''
    },
    searchInOtherDomains: !!formState.searchInOtherDomains
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
    const provider = await updateDriveProvider(props.domain.uuid, {
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
    await deleteDriveProvider(props.domain.uuid, props.provider);

    message.success(t('MESSAGES.DELETE_SUCCESS'));
    emit('deleted');
  } catch (error) {
    message.error(t('MESSAGES.DELETE_FAILURE'));
  }
}

function confirmDelete () {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('DRIVE_PROVIDER.DELETE_CONFIRM'),
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
