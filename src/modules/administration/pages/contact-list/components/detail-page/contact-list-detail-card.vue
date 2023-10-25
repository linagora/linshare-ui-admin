<template>
  <a-form ref="formRef">
    <div class="contact-list-detail-card">
      <span class="title">
        {{ $t('CONTACT_LIST.SETTING') }}
      </span>
      <div class="contact-list-detail-card__form">
        <a-form-item class="ls-form-title" v-bind="validateInfos.identifier" :label="$t('CONTACT_LIST.NAME')">
          <a-input
            id="name"
            v-model:value="activeContactListForm.identifier"
            :disabled="!editable"
            class="ls-input"
          ></a-input>
        </a-form-item>
        <a-form-item class="ls-form-title" :label="$t('CONTACT_LIST.DESCRIPTION')">
          <a-textarea
            id="name"
            v-model:value="activeContactListForm.description"
            :disabled="!editable"
            class="ls-input"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          ></a-textarea>
        </a-form-item>
        <a-form-item class="ls-form-title" v-bind="validateInfos.identifier" :label="$t('CONTACT_LIST.VISIBILITY')">
          <a-checkbox v-model:checked="activeContactListForm.public"> </a-checkbox>
          <span>{{ activeContactListForm.public ? $t('GENERAL.PUBLIC') : $t('GENERAL.PRIVATE') }}</span>
        </a-form-item>
      </div>

      <contact-list-detail-action
        :editable="editable"
        :editing="editing"
        :loading="loading"
        @cancel="onToggleEditContactList"
        @save="onUpdateContactList"
        @reset="onResetContactList"
        @delete="onDeleteContact"
      ></contact-list-detail-action>
      <div class="contact-list-detail-card__owner">
        <div class="owner">
          {{ $t('CONTACT_LIST.OWNER') }}
        </div>
        <div class="identifier">
          <a-avatar shape="circle" :size="46" class="profile-avatar">
            <span> {{ activeContactList.owner?.firstName.charAt(0) }}</span>
          </a-avatar>
          <div class="infor">
            <strong class="elipsis-name"
              >{{ activeContactList?.owner?.firstName }} {{ activeContactList?.owner?.lastName }}</strong
            >
            <span> {{ activeContactList?.owner?.mail }}</span>
          </div>
        </div>
      </div>
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form, FormInstance } from 'ant-design-vue';
import { Contact } from '@/modules/administration/pages/contact-list/types/Contact';
import useContactList from '@/modules/administration/pages/contact-list/hooks/useContactList';
import ContactListDetailAction from '@/modules/administration/pages/contact-list/components/detail-page/contact-list-detail-action.vue';

// composable
const { t } = useI18n();
const {
  loading,
  activeContactListForm,
  activeContactList,
  handleResetContactList,
  onDeleteContact,
  handleEditContactList,
  handleGetContactListDetail,
} = useContactList();
const formRef = ref<FormInstance>();
const useForm = Form.useForm;

const formRules = computed(() => ({
  identifier: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(activeContactListForm, formRules);

function onToggleEditContactList() {
  emits('edit-toggle');
}

async function onUpdateContactList() {
  const payload: Contact = {
    ...activeContactListForm.value,
  };
  await handleEditContactList(payload);
  await handleGetContactListDetail(activeContactList.value.uuid);
}

function onResetContactList() {
  handleResetContactList();
}
// props & emits
const props = defineProps<{
  editable?: boolean;
  editing?: boolean;
}>();
const emits = defineEmits(['update:modelValue', 'select-language', 'refresh']);
</script>
<style lang="less">
.contact-list-detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  .profile-avatar {
    background-color: @primary-color;
    color: @component-background;
    margin-right: 10px;
  }

  .title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }

  &__name {
    .aterisk {
      color: #ea3c3c;
    }
  }

  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border: none;
  }

  &__title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    width: 100%;
    color: #1b1d29;
    text-align: center;
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 28px;

    .ls-button {
      flex-grow: 1;
    }

    .ls-cancel,
    .ls-cancel:hover {
      background-color: #f3f3f7;
      color: #007aff;
      border-color: #f3f3f7;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  .ls-input {
    height: 44px;
    background: #fff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .ls-input .ant-select-dropdown {
    top: 0 !important;
    bottom: auto !important;
  }

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: 0;
  }

  .ant-form-item-label {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }

  .ant-form-item-label label {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.01em;
    color: #6d7885;
  }

  .ls-form-switch .ant-form-item-control {
    margin-top: -12px;
  }

  .ant-form-item-control-input {
    min-height: 42px;
  }

  .ant-col {
    min-height: unset;
  }

  .ls-form-title-switch .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row !important;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    width: fit-content;
    color: #434657;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    font-weight: normal;
  }

  .ls-switch {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 4px;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: #434657;
  }

  .ant-select-selector {
    height: 100% !important;
    border-radius: 10px;
  }

  .select-language {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 8px 16px;
    gap: 8px;
    min-width: 89px;
    height: 36px;
    background: #ffffff;
    border: 1px solid #dfe1e6;
    border-radius: 8px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: -0.02em;
    color: #3d3f49;
  }

  .select-language.selected {
    background: #e8f4ff;
    color: #1990ff;
    border-color: #e8f4ff;
  }

  .ls-languages {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
  }

  .ls-form-footer-language {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .ls-form-footer-language .ls-input-field {
    width: 30%;
    min-width: 30%;
  }

  .ls-form-footer-language .ls-select-field {
    flex-grow: 1;
    flex-shrink: 1;
  }

  &__owner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    border-radius: 12px;
    margin-top: 24px;
    background: var(--neutral-colors-color-table-header, #fafafa);
    text-align: left;

    .owner {
      color: var(--neutral-colors-color-text-title, #1b1d29);
      /* Desktop/Subtitle 2 - Medium */
      font-family: Inter;
      font-size: 17px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }

    .identifier {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;
      cursor: pointer;

      .infor {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        text-align: left;
      }

      .icon {
        width: 50px;
        height: 50px;
        background-color: #e8e5e5;
        border-radius: 100px;
        margin-right: 12px;
        text-align: left;
      }

      .infor strong {
        color: var(--neutral-colors-color-text-title, #1b1d29);
        /* Desktop/Subtitle 1 - Semibold */
        font-family: Inter;
        font-size: 17px;
        font-style: normal;
        font-weight: 600;
        line-height: 24px;
        text-align: left;
        /* 141.176% */
      }

      .infor span {
        color: var(--neutral-colors-color-placeholder, #989cb1);
        /* Desktop/Body 2 - Regular */
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        text-align: left;
        /* 142.857% */
        letter-spacing: -0.14px;
      }
    }
  }
}
</style>
