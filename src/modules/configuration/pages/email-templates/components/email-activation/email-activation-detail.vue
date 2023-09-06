<template>
  <div class="email-activation-item" :class="{ 'email-activation-item__active': isExpand }">
    <div class="email-activation-item__item-header">
      <div class="email-activation-item__item-header-left">
        <div class="email-activation-item__item-status">
          <a-tag v-if="item.enable" color="success">
            {{ $t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.ACTIVE') }}
          </a-tag>
          <a-tag v-else color="red"> {{ $t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.INACTIVE') }}</a-tag>
        </div>
        <div class="email-activation-item__item-identifier">
          {{ item.identifier }}
        </div>
      </div>
      <a-button type="text" class="email-activation-item__item-expand" @click="onExpandItem">
        <span v-if="index === 0">{{ $t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.SHOW_SETTING') }}</span>
        <chevron-right-icon width="20px" height="20px"></chevron-right-icon>
      </a-button>
    </div>
    <div v-if="isExpand" class="email-activation-item__detail">
      <div class="email-activation-item__detail-form">
        <strong class="email-activation-item__detail-info">{{
          $t(`EMAIL_TEMPLATES.MAIL_CONTENT_TYPE.${item.identifier}`)
        }}</strong>
        <a-form-item class="ls-form-title ls-form-title-switch" for="visible">
          <a-switch
            id="visible"
            v-model:checked="form.enableNotification"
            class="ls-switch"
            @change="onUpdateEmailActivation"
          />
          <span>
            {{ $t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.ENABLE_NOTIFICATION') }}
            <a-tooltip>
              <template #title>
                {{ $t(`EMAIL_TEMPLATES.MAIL_ACTIVATION.DETAILS.${item.identifier}.DESCRIPTION`) }}
              </template>
              <InfoCircleOutlined class="highlight" />
            </a-tooltip>
          </span>
        </a-form-item>
        <a-form-item class="ls-form-title ls-form-title-switch" for="visible">
          <a-switch
            id="visible"
            v-model:checked="form.overrideEnableNotification"
            class="ls-switch"
            @change="onUpdateEmailActivation"
          />
          <span>{{ $t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.ALLOW_OVERRIDE_SETTING') }}</span>
        </a-form-item>
      </div>
      <a-button v-if="!isRootDomain" class="email-activation-item__reset" @click="onResetEmailActivation">
        <replay-icon width="16px" height="16px"></replay-icon> {{ $t('EMAIL_TEMPLATES.EMAIL_ACTIVATION.RESET_BUTTON') }}
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MailActivation } from '../../types/MailActivation';
import ChevronRightIcon from '@/core/components/icons/chevron-right-icon.vue';
import useEmailTemplatesActivation from '../../hooks/useEmailTemplatesActivation';
import ReplayIcon from '@/core/components/icons/replay-icon.vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';

const props = defineProps<{
  item: MailActivation;
  index: number | string;
}>();
const { isRootDomain } = storeToRefs(useDomainStore());

const emits = defineEmits(['expand', 'reload']);

const { handleUpdateMailActivation, handleResetMailActivation } = useEmailTemplatesActivation();
const form = reactive({
  enableNotification: false,
  overrideEnableNotification: false,
});

const isExpand = ref(false);

function onExpandItem() {
  isExpand.value = !isExpand.value;
  if (isExpand.value) {
    emits('expand', props.item);
    form.enableNotification = props.item.enable;
    form.overrideEnableNotification = props.item.configurationPolicy.parentAllowUpdate;
  } else {
    emits('expand', null);
  }
}

async function onUpdateEmailActivation() {
  const payload: MailActivation = {
    ...props.item,
    configurationPolicy: { ...props.item.configurationPolicy, parentAllowUpdate: form.overrideEnableNotification },
    enable: form.enableNotification,
  };

  await handleUpdateMailActivation(payload);
  emits('reload');
}

async function onResetEmailActivation() {
  const payload: MailActivation = {
    ...props.item,
    configurationPolicy: { ...props.item.configurationPolicy, parentAllowUpdate: form.overrideEnableNotification },
    enable: form.enableNotification,
  };

  await handleResetMailActivation(payload);
  emits('reload');
}
</script>
<style lang="less">
.email-activation-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;

  .ant-tag.ant-tag-success {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #e8f4ff;
    border-radius: 5px;
    color: #007aff;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  .ant-tag.ant-tag-red {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #fff3f3;
    border-radius: 5px;
    color: #ea3c3c;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  .ant-tag.ant-tag-default {
    padding: 4px 8px;
    gap: 8px;
    min-width: 44px;
    height: 24px;
    background: #f3f3f7;
    border-radius: 5px;
    color: #989cb1;
    border: none;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }

  &__item-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  &__item-header-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  &__item-status {
    padding: 16px;
  }

  &__item-identifier {
    padding: 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    flex-grow: 1;
    min-width: 60px;
    width: fit-content;
    white-space: nowrap;
  }

  &__item-expand {
    color: @primary-color;
    background-color: transparent;
    min-width: 40px;
    font-weight: 400;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  &__item-expand:hover,
  &__item-expand:focus {
    background-color: transparent;
    color: @primary-color;
  }

  &__detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding-left: 108px;
  }

  &__reset {
    display: flex;
    padding: 0px 20px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid var(--neutral-colors-color-border, #d5d7e0);
    background: var(--neutral-colors-color-white, #fff);
    color: var(--support-colors-error-500, #ea3c3c);
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    margin-left: 16px;
  }
  &__reset svg {
    margin-right: 4px;
  }

  &__detail-info {
    color: #1b1d29;
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 17px;
    display: inline-block;
  }
  .ls-form-title-switch {
    color: #343745;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 125% */
    letter-spacing: -0.32px;
    margin-bottom: 17px;
  }
  .ls-switch {
    margin-right: 16px;
  }
}

.email-activation-item__active {
  background-color: #f2f8ff;
}

.highlight {
  color: @primary-color;
  margin-left: 4px;
}
</style>
