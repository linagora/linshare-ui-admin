<template>
  <a-modal
    :visible="visible"
    :title="editMode ? $t('REMOTE_SERVER.LDAP.MODAL.EDIT_TITLE') : $t('REMOTE_SERVER.LDAP.MODAL.CREATE_TITLE')"
    @cancel="$emit('cancel')"
  >
    <template #footer>
      <div class="footer">
        <a-button @click="resetForm">
          {{ $t('GENERAL.RESET') }}
        </a-button>

        <div>
          <a-button @click="$emit('cancel')">
            {{ $t('GENERAL.CANCEL') }}
          </a-button>
          <a-button :loading="formSubmitting" type="primary" @click="onSave">
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </div>
    </template>

    <a-form ref="formRef" :model="formState" :rules="formRules">
      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('GENERAL.NAME')"
        name="name"
        required
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('REMOTE_SERVER.FIELDS.PROVIDED_URL')"
        name="url"
        required
      >
        <a-input v-model:value="formState.url" />
        <small><em>eg: [ldap/ldaps]://my.ldap.lng:[389/636]</em></small>
      </a-form-item>

      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('REMOTE_SERVER.FIELDS.LDAP_BINDDN')"
        name="bindDn"
      >
        <a-input v-model:value="formState.bindDn" />
      </a-form-item>

      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('REMOTE_SERVER.FIELDS.LDAP_PASSWORD')"
        name="bindPassword"
      >
        <a-input-password v-model:value="formState.bindPassword" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { LDAPRemoteServer } from '../types/RemoteServer';
import { createRemoteServer, updateRemoteServer } from '../services/remote-server-api';

interface Props {
  visible: boolean;
  data: LDAPRemoteServer;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});
const emit = defineEmits(['cancel', 'success']);
const { t } = useI18n();
const editMode = computed(() => !!props.data?.uuid);
const formSubmitting = ref(false);
const formRef = ref();
const formState = reactive<Omit<LDAPRemoteServer, 'uuid'>>({
  serverType: 'LDAP',
  name: props.data?.name,
  url: props.data?.url,
  bindDn: props.data?.bindDn,
  bindPassword: props.data?.bindPassword,
});
const formRules = computed(() => ({
  name: [{ required: true, message: t('REMOTE_SERVER.VALIDATION.NAME_REQUIRED'), trigger: 'blur' }],
  url: [{ required: true, message: t('REMOTE_SERVER.VALIDATION.URL_REQUIRED'), trigger: 'blur' }],
}));

function resetForm() {
  formState.name = props.data?.name;
  formState.url = props.data?.url;
  formState.bindDn = props.data?.bindDn;
  formState.bindPassword = props.data?.bindPassword;
}

async function onSave() {
  formSubmitting.value = true;

  try {
    await formRef.value.validate();
  } catch (error) {
    formSubmitting.value = false;
    return;
  }

  try {
    await (editMode.value ? updateRemoteServer({ ...props.data, ...formState }) : createRemoteServer({ ...formState }));

    emit('success');
    message.success(t(editMode.value ? 'MESSAGES.UPDATE_SUCCESS' : 'MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    message.error(t('ERRORS.COMMON_MESSAGE'));
  } finally {
    formSubmitting.value = false;
  }
}

watchEffect(() => {
  if (props.visible) resetForm();
});
</script>

<style lang="less" scoped>
.ant-form-item small {
  color: @text-color-secondary;
}

.footer {
  display: flex;
  justify-content: space-between;
}
</style>
