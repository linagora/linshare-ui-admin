<template>
  <a-modal :visible="props.visible" :title="$t(title)" @cancel="onCancel">
    <template #footer>
      <div class="footer">
        <div>
          <a-button @click="onCancel">
            {{ $t('GENERAL.CANCEL') }}
          </a-button>
          <a-button :loading="formSaving" type="primary" @click="onSave">
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </div>
    </template>

    <a-form ref="formRef" :model="formState" :rules="formRules">
      <a-form-item :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" :label="$t('DOMAIN.FIELDS.PARENT_DOMAIN')">
        <a-input :value="parent?.name" readonly />
      </a-form-item>

      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('DOMAIN.FIELDS.NAME')"
        name="name"
        required
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('GENERAL.DESCRIPTION')"
        name="description"
      >
        <a-input v-model:value="formState.description" />
      </a-form-item>

      <a-form-item>
        <a-checkbox v-model:checked="formState.dedicatedDomainPolicy">
          {{ $t('DOMAIN.FIELDS.DOMAIN_POLICY_AUTO') }}

          <a-tooltip>
            <template #title>
              {{ $t('DOMAIN.CREATE_MODAL.DOMAIN_POLICY_AUTO_TOOLTIP') }}
            </template>

            <InfoCircleOutlined class="highlight" />
          </a-tooltip>
        </a-checkbox>
      </a-form-item>

      <p class="note">
        <InfoCircleOutlined />
        {{ $t('DOMAIN.CREATE_MODAL.FOOTER_NOTE') }}
      </p>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { createDomain } from '../services/domain-api';
import Domain, { DOMAIN_TYPE } from '../types/Domain';
import { APIError } from '@/core/types/APIError';

export interface DomainCreationFormModalProps {
  visible: boolean;
  type?: DOMAIN_TYPE.GUEST | DOMAIN_TYPE.SUB | DOMAIN_TYPE.TOP;
  parent?: Partial<Domain>;
}

const props = defineProps<DomainCreationFormModalProps>();
const emit = defineEmits(['cancel', 'success']);
const title = computed(
  () =>
    ({
      [DOMAIN_TYPE.TOP]: 'DOMAIN.CREATE_TOP_DOMAIN',
      [DOMAIN_TYPE.SUB]: 'DOMAIN.CREATE_SUB_DOMAIN',
      [DOMAIN_TYPE.GUEST]: 'DOMAIN.CREATE_GUEST_DOMAIN',
    }[props.type || DOMAIN_TYPE.TOP])
);

const { t } = useI18n();
const formSaving = ref(false);
const formRef = ref();
const formState = reactive({
  name: '',
  description: '',
  dedicatedDomainPolicy: false,
});
const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: t('DOMAIN.FIELDS.NAME_REQUIRED'),
      trigger: 'blur',
    },
  ],
}));

async function onSave() {
  formSaving.value = true;

  try {
    await formRef.value.validate();
  } catch (error) {
    formSaving.value = false;
    return;
  }

  try {
    await createDomain(
      {
        name: formState.name,
        description: formState.description ? formState.description : undefined,
        parent: props.parent,
        type: props.type,
      },
      formState.dedicatedDomainPolicy
    );

    emit('success');
    resetForm();
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    message.error((error as APIError).getMessage());
  } finally {
    formSaving.value = false;
  }
}

function onCancel() {
  resetForm();
  emit('cancel');
}

function resetForm() {
  formState.name = '';
  formState.dedicatedDomainPolicy = false;
  formState.description = '';
}
</script>

<style lang="less" scoped>
.note {
  color: @text-color-secondary;
}

.highlight {
  color: @primary-color;
}
</style>
