<template>
  <div v-if="data.uuid && !isDuplicating && !data.readOnly" class="actions">
    <a-button class="action-button" type="primary" @click="toggleEditMode()">
      {{ $t(mode.edit ? 'GENERAL.CANCEL' : 'GENERAL.EDIT') }}
    </a-button>

    <a-button
      v-if="messageUuid !== defaultWelcomeMessageUuid"
      class="action-button"
      type="primary"
      danger
      @click="$emit('delete')"
    >
      {{ $t('GENERAL.DELETE') }}
    </a-button>
  </div>
  <a-row class="top-panel" justify="center">
    <a-col :md="12" :sm="24">
      <div v-if="isDuplicating || !data.uuid || mode.edit" class="form-info">
        <a-form layout="vertical">
          <a-form-item :label="$t('DOMAIN.FIELDS.NAME')" v-bind="validateInfos.name">
            <div class="input-container">
              <a-input v-model:value="formState.name" :maxlength="255"></a-input>
            </div>
          </a-form-item>

          <a-form-item>
            <div class="input-container">
              <label class="input-label">{{ $t('GENERAL.DESCRIPTION') }}</label
              ><br />
              <a-textarea v-model:value="formState.description" />
            </div>
          </a-form-item>
        </a-form>
      </div>
      <div v-else class="form-info">
        <a-form layout="vertical">
          <a-form-item :label="$t('DOMAIN.FIELDS.NAME')">
            <div class="input-container">
              <p>{{ formState.name }}</p>
            </div>
          </a-form-item>

          <a-form-item>
            <div class="input-container">
              <label class="input-label">{{ $t('GENERAL.DESCRIPTION') }}</label
              ><br />
              <p>{{ formState.description }}</p>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-col>

    <a-col v-if="data.uuid && !isDuplicating" :md="12" :sm="24">
      <div class="info-block-container">
        <div class="info-block">
          <div v-if="data.creationDate" class="info-block">
            <span class="title">{{ $t('GENERAL.CREATION_DATE') }}</span>
            <span class="value">
              {{ $d(data.creationDate, 'mediumDate') }}
            </span>
          </div>

          <div v-if="data.modificationDate" class="info-block">
            <span class="title">{{ $t('GENERAL.MODIFICATION_DATE') }}</span>
            <span class="value">
              {{ $d(data.modificationDate, 'mediumDate') }}
            </span>
          </div>

          <div v-if="data.domain?.name" class="info-block">
            <div class="title">
              {{ $t('GENERAL.DOMAIN') }}
            </div>
            <div class="value">
              <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: data.domain?.uuid } }">
                {{ data.domain?.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>

  <div>
    <div class="collapse">
      <a-button shape="round" size="middle" @click="collapse()">
        {{ $t(!mode.collapse ? 'GENERAL.COLLAPSE' : 'GENERAL.EXPAND') }}
      </a-button>
    </div>

    <h5 v-if="!mode.edit">
      <i>{{ $t('WELCOME_MESSAGES.MESSAGE_PREVIEW') }}</i>
    </h5>

    <div class="message_collapse">
      <a-collapse v-model:activeKey="collapsedKeys" @click="collapse()">
        <a-collapse-panel v-for="key in Object.keys(formState.entries)" :key="key" :header="$t(`LOCALE.${key}`)">
          <template #extra>{{ flagMappings[key] || '🌍' }}</template>
          <span v-if="!mode.edit && data.uuid && !isDuplicating" v-html="formState.entries[key]"></span>
          <a-textarea v-else v-model:value="formState.entries[key]" :rows="10" />
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div v-if="mode.edit && data.uuid">
      <a-button class="action-button" @click="setFormData()">
        {{ $t('GENERAL.RESET') }}
      </a-button>
      <a-button class="action-button" type="primary" @click="submit()">
        {{ $t('GENERAL.SAVE') }}
      </a-button>
    </div>
  </div>
  <div v-if="!data.uuid || isDuplicating">
    <a-button class="action-button" type="primary" @click="submit()">
      {{ $t('GENERAL.CREATE') }}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import WelcomeMessage from '../types/WelcomeMessages';
import config from '@/config';
import { useI18n } from 'vue-i18n';
import { Form } from 'ant-design-vue';

const { t } = useI18n();
const { currentRoute } = useRouter();
const messageUuid = currentRoute.value.params.uuid;
const emit = defineEmits(['delete', 'submit']);
const useForm = Form.useForm;
const router = useRouter();
const defaultWelcomeMessageUuid = config.rootWelcomeMessageUuid;
const isDuplicating = computed(
  () => !!router.currentRoute.value.query.duplicate && router.currentRoute.value.name === 'DomainWelcomeMessageNew'
);
const props = defineProps<{
  data: WelcomeMessage;
}>();
const collapsedKeys = ref(Object.keys(props.data.entries));

interface FormState {
  name: string;
  description: string;
  entries: Record<string, string>;
}

const flagMappings = reactive<Record<string, string>>({
  VIETNAMESE: '🇻🇳',
  FRENCH: '🇫🇷',
  ENGLISH: '🇺🇸',
  RUSSIAN: '🇷🇺',
});

const formState = reactive<FormState>({
  name: props.data.name,
  description: props.data.description || '',
  entries: {},
});

Object.keys(props.data?.entries).forEach((key) => {
  if (key) {
    formState.entries[key as string] = props.data?.entries[key];
  }
});

const mode = reactive({
  edit: false,
  collapse: false,
});

const formRules = reactive({
  name: [{ required: true, message: t('WELCOME_MESSAGES.SET_FIELD') }],
});

const { validate, validateInfos } = useForm(formState, formRules);

function collapse() {
  if (mode.collapse === true) {
    collapsedKeys.value = Object.keys(flagMappings);
    mode.collapse = false;
  } else {
    collapsedKeys.value = [];
    mode.collapse = true;
  }
}

function toggleEditMode() {
  if ((mode.edit = !mode.edit)) {
    mode.edit = true;
  } else {
    mode.edit = false;
    setFormData();
  }
}

async function submit() {
  await validate();
  const payload: WelcomeMessage = { ...props.data, ...formState };

  payload.description = payload.description === '' ? undefined : payload.description;
  Object.keys(payload.entries).forEach((key) => {
    if (!payload.uuid && payload.entries[key] === '') {
      delete payload.entries[key];
    }
  });

  emit('submit', payload);
}

watchEffect(() => {
  if (props.data) {
    setFormData();
  }
});

function setFormData() {
  formState.name = props.data.name;
  formState.description = props.data.description || '';
  Object.keys(props.data?.entries).forEach((key) => {
    if (key) {
      formState.entries[key as string] = props.data?.entries[key];
    }
  });
}
</script>

<style lang="less" scoped>
.top-panel {
  border: 1px solid @token-input-outer-bg;
  padding: 10px;
  border-radius: 4px;
}

.info-block {
  display: flex;
  flex-direction: column;
  margin: 10px 0;

  .title {
    color: @text-color-secondary;
    margin-bottom: 10px;
  }
}

.actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.top-panel {
  display: flex;
  align-items: center;
  border: 1px solid @token-input-outer-bg;
  padding: 10px;
  border-radius: 4px;
}

.action-button {
  margin-top: 5px;
  margin-right: 5px;
}

.collapse {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.message_collapse {
  margin-top: 10px;
  margin-bottom: 10px;
}

.input-container {
  margin-right: 150px;
  min-width: 100px;
  word-wrap: break-word;
}

.input-label {
  font-weight: 500;
}
</style>
