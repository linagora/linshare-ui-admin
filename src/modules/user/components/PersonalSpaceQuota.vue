<template>
  <a-row type="flex" :gutter="30">
    <a-col :lg="{ span: 10, offset: 7 }" :sm="{ span: 12, offset: 6 }" :xs="24">
      <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
        <span class="status">{{ $t('QUOTA.USED_SPACE', { usedSpace, computedQuota }) }}</span>
        <a-progress :percent="percentUsed" />

        <div class="field">
          <span class="title">
            {{ $t('QUOTA.USER_QUOTA') }}
          </span>
          <div class="default-value">
            <span>{{ $t('GENERAL.DEFAULT_VALUE') }}:</span>
            <span class="value">{{ defaultQuota }}</span>
          </div>

          <a-form-item :label="$t('GENERAL.CURRENT_VALUE')" v-bind="validateInfos.quota">
            <a-row justify="space-between">
              <a-col flex="1">
                <SizeInput v-model:value="quotaForm.quota" />
              </a-col>

              <a-col>
                <a-button type="link" @click="quotaForm.quota = userQuota.defaultQuota">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </div>

        <div class="field">
          <span class="title">
            {{ $t('QUOTA.USER_MAX_FILE_SIZE') }}
          </span>
          <div class="default-value">
            <span>{{ $t('GENERAL.DEFAULT_VALUE') }}:</span>
            <span class="value">{{ defaultMaxFileSize }}</span>
          </div>
          <a-form-item :label="$t('GENERAL.CURRENT_VALUE')" v-bind="validateInfos.maxFileSize">
            <a-row justify="space-between">
              <a-col flex="1">
                <SizeInput v-model:value="quotaForm.maxFileSize" />
              </a-col>

              <a-col>
                <a-button type="link" @click="quotaForm.maxFileSize = userQuota.defaultMaxFileSize">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </div>

        <a-row justify="space-between" :gutter="[16, 16]">
          <a-col>
            <a-button
              @click="
                quotaForm.maxFileSize = userQuota.defaultMaxFileSize;
                quotaForm.quota = userQuota.defaultQuota;
              "
            >
              {{ $t('GENERAL.USE_DEFAULTS') }}
              <template #icon>
                <ReloadOutlined />
              </template>
            </a-button>
          </a-col>

          <a-col>
            <a-button class="reset" type="primary" @click="resetFields">
              {{ $t('GENERAL.RESET') }}
            </a-button>

            <a-button style="margin-left: 10px" type="primary" :loading="saving" @click="onSave">
              {{ $t('GENERAL.SAVE') }}
              <template #icon>
                <CheckOutlined />
              </template>
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { message, Form } from 'ant-design-vue';
import { useUserStore } from '@/modules/user/store';
import { APIError } from '@/core/types/APIError';
import { getReadableSize } from '@/core/utils/unitStorage';
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { getUserQuota, updateUserQuota } from '@/modules/user/services/user-api';
import SizeInput from '@/core/components/SizeInput.vue';

const userStore = useUserStore();
const { t, locale } = useI18n();
const useForm = Form.useForm;
const { user } = storeToRefs(userStore);
const data = await getUserQuota(user.value?.uuid || '', user.value?.quotaUuid || '');
const userQuota = reactive(data);
const saving = ref(false);
const quotaForm = reactive({
  maxFileSize: data.maxFileSize,
  quota: data.quota,
});

const defaultMaxFileSize = getReadableSize(userQuota.defaultMaxFileSize).getText();
const defaultQuota = getReadableSize(userQuota.defaultQuota).getText();
const computedQuota = computed(() => getReadableSize(userQuota.quota).getText());
const usedSpace = computed(() => getReadableSize(userQuota.realTimeUsedSpace).getText());
const percentUsed = computed(() => Math.round((userQuota.realTimeUsedSpace / userQuota.quota) * 100));

const rules = computed(() => ({
  quota: [
    {
      min: quotaForm.maxFileSize,
      type: 'number',
      message: t('QUOTA.ERROR.QUOTA_LESS_THAN_FILE_SIZE', locale.value),
      trigger: 'change',
    },
  ],
  maxFileSize: [
    {
      max: quotaForm.quota,
      type: 'number',
      message: t('QUOTA.ERROR.FILE_SIZE_LARGER_THAN_QUOTA', locale.value),
      trigger: 'change',
    },
    { min: 0, type: 'number', message: t('QUOTA.ERROR.INVALID_FILE_SIZE', locale.value), trigger: 'change' },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(quotaForm, rules);

async function onSave() {
  if (!user.value) return;

  saving.value = true;

  try {
    await validate();
  } catch (error) {
    saving.value = false;
    return;
  }

  try {
    await updateUserQuota(user.value?.uuid, {
      ...userQuota,
      ...quotaForm,
    });

    userQuota.quota = quotaForm.quota;
    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    } else {
      console.error(error);
    }
  }

  saving.value = false;
}
</script>

<style lang="less" scoped>
.status {
  font-weight: 600;
  font-size: 16px;
}
.field {
  margin-top: 20px;
}

.title {
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}

.reset {
  background-color: @text-color-primary-heavy;
  border-color: @text-color-primary-heavy;
}
.default-value {
  display: block;
  margin-bottom: 5px;

  .value {
    margin-left: 5px;
    border: 0px;
    background: @background-color-base;
    border-radius: 3px;
    padding: 7px;
    text-transform: uppercase;
  }
}
</style>
