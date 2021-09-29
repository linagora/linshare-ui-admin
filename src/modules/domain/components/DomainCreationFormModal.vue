<template>
  <a-modal
    :visible="props.visible"
    :title="$t(title)"
    @cancel="$emit('cancel')"
  >
    <template #footer>
      <div class="footer">
        <div>
          <a-button @click="$emit('cancel')">
            {{ $t('GENERAL.CANCEL') }}
          </a-button>
          <a-button
            :loading="formSaving"
            type="primary"
            @click="onSave"
          >
            {{ $t('GENERAL.SAVE') }}
          </a-button>
        </div>
      </div>
    </template>

    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
    >
      <a-form-item
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('DOMAIN.FIELDS.PARENT_DOMAIN')"
      >
        <a-input
          :value="parent?.name"
          readonly
        />
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
import { computed, defineProps, defineEmits, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import DomainAPIClient from '../services/DomainAPIClient';
import Domain, { DOMAIN_TYPE } from '../type/Domain';

export interface DomainCreationFormModalProps {
  visible: boolean;
  type?: Exclude<DOMAIN_TYPE, DOMAIN_TYPE.ROOT>;
  parent?: Partial<Domain>;
}

const props = defineProps<DomainCreationFormModalProps>();
const emit = defineEmits(['cancel', 'success']);
const title = computed(() => ({
  [DOMAIN_TYPE.TOP]: 'DOMAIN.CREATE_TOP_DOMAIN',
  [DOMAIN_TYPE.SUB]: 'DOMAIN.CREATE_SUB_DOMAIN',
  [DOMAIN_TYPE.GUEST]: 'DOMAIN.CREATE_GUEST_DOMAIN'
}[props.type || DOMAIN_TYPE.TOP]));

const { t } = useI18n();
const formSaving = ref(false);
const formRef = ref();
const formState = reactive({
  name: '',
  description: '',
  dedicatedDomainPolicy: false
});
const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: t('DOMAIN.FIELDS.NAME_REQUIRED'),
      trigger: 'blur'
    }
  ]
}));

async function onSave () {
  formSaving.value = true;

  try {
    await formRef.value.validate();
  } catch (error) {
    formSaving.value = false;
    return;
  }

  try {
    await DomainAPIClient.createDomain({
      name: formState.name,
      description: formState.description,
      parent: props.parent,
      type: props.type
    }, formState.dedicatedDomainPolicy);

    emit('success');
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    message.error(t('ERRORS.COMMON_MESSAGE'));
  } finally {
    formSaving.value = false;
  }
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
