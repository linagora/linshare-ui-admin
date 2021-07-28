<template>
  <div class="personal-space-quota">
    <a-row type="flex" :gutter="30" class="personal-space-quota__row">
      <a-col :xl="9" :lg="12" :sm="12" :xs="24">
        <a-form :model="quotaForm" :rules="rules" ref="formRef" validate-on-rule-change>
          <span class="personal-space-quota__status">{{ $t('QUOTA.USED_SPACE', { usedSpace, computedQuota }) }}</span>
          <a-progress :percent="percentUsed" />

          <div class="personal-space-quota__field">
            <span class="personal-space-quota__title">
              {{ $t('QUOTA.USER_QUOTA') }}
            </span>
            <div class="personal-space-quota__default-value">
              <span>{{ $t('GENERAL.DEFAULT_VALUE') }}:</span>
              <span class="value">{{defaultQuota}}</span>
            </div>

            <a-form-item :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" :label="$t('GENERAL.CURRENT_VALUE')" name="quota">
              <SizeInput v-model="quotaForm.quota"/>

              <a-button type="link" @click="quotaForm.quota = userQuota.defaultQuota">
                <template #icon>
                  <ReloadOutlined />
                </template>
              </a-button>
            </a-form-item>
          </div>

          <div class="personal-space-quota__field">
            <span class="personal-space-quota__title">
              {{ $t('QUOTA.USER_MAX_FILE_SIZE') }}
            </span>
            <div class="personal-space-quota__default-value">
              <span>{{ $t('GENERAL.DEFAULT_VALUE') }}:</span>
              <span class="value">{{defaultMaxFileSize}}</span>
            </div>
            <a-form-item :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" :label="$t('GENERAL.CURRENT_VALUE')" name="maxFileSize">
              <SizeInput v-model="quotaForm.maxFileSize"/>

              <a-button type="link" @click="quotaForm.maxFileSize = userQuota.defaultMaxFileSize">
                <template #icon>
                  <ReloadOutlined />
                </template>
              </a-button>
            </a-form-item>
          </div>

          <div class="personal-space-quota__action-buttons">
            <div>
              <a-button @click="quotaForm.maxFileSize = userQuota.defaultMaxFileSize; quotaForm.quota = userQuota.defaultQuota;">
                {{ $t('GENERAL.USE_DEFAULTS') }}
                <template #icon>
                  <ReloadOutlined />
                </template>
              </a-button>
            </div>
            <div>
              <a-button class="reset" type="primary" @click="resetForm">{{ $t('GENERAL.RESET') }}</a-button>
              <a-button style="margin-left: 10px" type="primary" @click="onSave" :loading="saving">
                {{ $t('GENERAL.SAVE') }}
                <template #icon>
                  <CheckOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { ReloadOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { getReadableSize } from '@/core/utils/unitStorage';
import SizeInput from '@/core/components/SizeInput.vue';
import UserAPIClient from '@/modules/user/services/UserAPIClient';

export default defineComponent({
  name: 'PersonalSpaceQuota',
  components: {
    CheckOutlined,
    ReloadOutlined,
    SizeInput
  },
  async setup () {
    const store = useStore();
    const { t } = useI18n();
    const { uuid, quotaUuid } = store.getters['User/getUser'];
    const data = await UserAPIClient.getUserQuota(uuid, quotaUuid);
    const userQuota = reactive(data);
    const saving = ref(false);
    const formRef = ref();
    const quotaForm = reactive({
      maxFileSize: data.maxFileSize,
      quota: data.quota
    });

    const rules = computed(() => ({
      quota: [
        { min: quotaForm.maxFileSize, type: 'number', message: t('QUOTA.ERROR.QUOTA_LESS_THAN_FILE_SIZE'), trigger: 'change' }
      ],
      maxFileSize: [
        { max: quotaForm.quota, type: 'number', message: t('QUOTA.ERROR.FILE_SIZE_LARGER_THAN_QUOTA'), trigger: 'change' },
        { min: 0, type: 'number', message: t('QUOTA.ERROR.INVALID_FILE_SIZE'), trigger: 'change' }
      ]
    }));

    async function onSave () {
      saving.value = true;

      try {
        await formRef.value.validate();
      } catch (error) {
        saving.value = false;
        return;
      }

      try {
        await UserAPIClient.updateUserQuota(uuid, {
          ...userQuota,
          ...quotaForm
        });

        userQuota.quota = quotaForm.quota;
        message.success(t('MESSAGES.UPDATE_SUCCESS'));
      } catch (error) {
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
      }

      saving.value = false;
    }
    function resetForm () {
      formRef.value.resetFields();
    }

    return {
      quotaForm,
      formRef,
      onSave,
      resetForm,
      rules,
      saving,
      userQuota,
      defaultMaxFileSize: getReadableSize(userQuota.defaultMaxFileSize).getText(),
      defaultQuota: getReadableSize(userQuota.defaultQuota).getText(),
      computedQuota: computed(() => getReadableSize(userQuota.quota).getText()),
      usedSpace: computed(() => getReadableSize(userQuota.realTimeUsedSpace).getText()),
      percentUsed: computed(() => Math.round(userQuota.realTimeUsedSpace / userQuota.quota * 100))
    };
  }
});
</script>

<style lang="less">
.personal-space-quota {
  .ant-form-item-control .ant-form-item-children {
    display: flex;
  }
}
</style>

<style lang="less" scoped>
.personal-space-quota {
  &__row {
    justify-content: center;

    .ant-col {
      margin: 10px 0px;
    }
  }

  &__status {
    font-weight: 600;
    font-size: 16px;
  }

  &__field {
    margin-top: 20px;
  }

  &__title {
    font-weight: 600;
    display: block;
    margin-bottom: 10px;
  }

  &__label {
    display: block;
    margin-bottom: 10px;
  }

  &__action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;

    .reset {
      background-color: #1B4157;
      border-color: #1B4157;
    }
  }

  &__default-value {
    display: block;
    margin-bottom: 5px;

    .value {
      margin-left: 5px;
      border: 0px;
      background: #F2F5F7;
      border-radius: 3px;
      padding: 7px;
      text-transform: uppercase;
    }
  }
}
</style>
