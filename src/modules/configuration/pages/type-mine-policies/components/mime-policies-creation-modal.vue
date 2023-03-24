<template>
  <a-modal
    class="creation-modal"
    :visible="props.visible"
    :title="$t('MIME_POLICIES.CREATE_MIME_POLICY')"
    :destroy-on-close="true"
    @cancel="$emit('close'), reset()"
  >
    <template #footer>
      <div class="footer">
        <a-button class="cancel ls-button" :disabled="status === STATUS.LOADING" @click="$emit('close'), reset()">
          {{ $t('GENERAL.CANCEL') }}
        </a-button>
        <a-button
          class="save ls-button"
          type="primary"
          :disabled="status === STATUS.LOADING || formState.name === ''"
          @click="MimePolicyCreation()"
        >
          {{ $t('GENERAL.SAVE') }}
        </a-button>
      </div>
    </template>
    <a-spin v-if="status === STATUS.LOADING" class="spin-load" />
    <div v-else>
      <a-form layout="vertical">
        <a-form-item v-bind="validateInfos.name" required :label="$t('DOMAIN.FIELDS.NAME')">
          <div>
            <a-input v-model:value="formState.name" :allow-clear="true"></a-input>
          </div>
        </a-form-item>
      </a-form>
      <div class="system-informations">
        <h3 class="section-title">{{ $t('MIME_POLICIES.SYSTEM_INFORMATIONS') }}</h3>
        <div class="info-block">
          <GlobeIcon class="systeme-icon"></GlobeIcon>
          <div>
            <div class="title">{{ $t('GENERAL.DOMAIN') }}</div>
            <div class="value">
              <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: currentDomain.uuid } }">
                <a href="">{{ currentDomain.name }}</a>
              </router-link>
            </div>
          </div>
        </div>
        <div class="info-block">
          <CalendarIcon class="systeme-icon"></CalendarIcon>
          <div>
            <div class="title">{{ $t('GENERAL.CREATION_DATE') }}</div>
            <div class="value">
              {{ $d(timestamp, 'mediumDate') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { APIError } from '@/core/types/APIError';
import { STATUS } from '@/core/types/Status';
import { message } from 'ant-design-vue';
import { createMimePolicy } from '../services/mime-policies-api';
import { Form } from 'ant-design-vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import CalendarIcon from '@/core/components/icons/calendar-icon.vue';
import { useI18n } from 'vue-i18n';
import { useDomainStore } from '@/modules/domain/store';
import dayjs from 'dayjs';

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const now = dayjs();
const timestamp = now.valueOf();
const domainStore = useDomainStore();
const status = ref(STATUS.SUCCESS);
const currentDomain = computed(() => domainStore.currentDomain);
const useForm = Form.useForm;
const { t } = useI18n();
const emit = defineEmits(['close', 'refresh']);
const formState = reactive({
  name: '',
});
const formRules = computed(() => ({
  name: [{ required: true, message: t('GENERAL.FIELD_REQUIRED'), trigger: 'change' }],
}));
const { validate, validateInfos } = useForm(formState, formRules);

async function MimePolicyCreation() {
  status.value = STATUS.LOADING;
  try {
    const payload = {
      name: formState.name,
      domainId: currentDomain.value.uuid,
    };
    await validate();
    await createMimePolicy(payload);
    emit('close');
    reset();
    emit('refresh');
    status.value = STATUS.SUCCESS;
    message.success(t('MESSAGES.CREATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function reset() {
  formState.name = '';
}
</script>

<style lang="less">
.creation-modal {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 !important;
  top: 0 !important;
  .ant-modal-header {
    border-radius: 16px;
    border-bottom: none;
    .ant-modal-title {
      text-align: center;
    }
  }

  .ant-modal-content {
    border-radius: 16px;
  }

  .ant-modal-footer {
    border-top: none;
    padding: 10px 24px 20px;
  }

  .footer {
    display: flex;

    .cancel {
      flex: 1;
    }

    .save {
      flex: 1;
    }
  }
  .spin-load {
    margin-left: 50%;
  }
  .system-informations {
    border-radius: 12px;
    background-color: #fafafa;
    padding: 16px;

    .title {
      color: #6d7885;
    }
  }
  .info-block {
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
  }
  .systeme-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    color: #6d7885;
  }

  .section-title {
    margin-bottom: 15px;
    color: #434657;
  }
}
</style>
