<template>
  <div class="contact-list-detail-header">
    <div class="contact-list-detail-header__title">
      {{ $t('CONTACT_LIST.CONTACT_LIST') }}
    </div>
    <div class="contact-list-detail-header__action">
      <a-input
        v-model:value="filterMail"
        :placeholder="$t('CONTACT_LIST.SEARCH_BY')"
        class="contact-list-detail-header__action-input ls-input"
        allow-clear
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <div>
        <a-button v-if="editable && !editing" class="ls-button ls-add" @click="editing = true">
          <PlusOutlined />
          {{ $t('CONTACT_LIST.ADD_CONTACT') }}
        </a-button>
        <a-button v-if="editable && editing" class="ls-button ls-cancel" @click="editing = false">
          {{ $t('GENERAL.CANCEL') }}
        </a-button>
      </div>
    </div>

    <div v-if="editing" class="contact-list-detail-header__rule-form">
      <a-form-item style="width: 30%" v-bind="validateInfos.mail" class="ls-form-title">
        <a-input v-model:value="form.mail" :placeholder="$t('CONTACT_LIST.EMAIL')" class="ls-input" allow-clear>
        </a-input>
      </a-form-item>
      <a-form-item style="width: 30%" v-bind="validateInfos.firstName" class="ls-form-title">
        <a-input
          v-model:value="form.firstName"
          :placeholder="$t('CONTACT_LIST.FIRST_NAME')"
          class="ls-input"
          allow-clear
        >
        </a-input>
      </a-form-item>
      <a-form-item style="width: 30%" v-bind="validateInfos.lastName" class="ls-form-title">
        <a-input v-model:value="form.lastName" :placeholder="$t('CONTACT_LIST.LAST_NAME')" class="ls-input" allow-clear>
        </a-input>
      </a-form-item>
      <a-button :disabled="!editing || !editable" class="ls-button ls-save" @click="onAddContactListEmail">
        {{ $t('CONTACT_LIST.CREATE_CONTACT') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import useContactList from '../../hooks/useContactList';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { computed, reactive, ref } from 'vue';
import { ContactInfo } from '../../types/Contact';
import { message, Form, FormInstance } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const useForm = Form.useForm;
const { t } = useI18n();

// props & emits
const props = defineProps<{
  editable?: boolean;
}>();

const emits = defineEmits(['refresh']);

const form = reactive<ContactInfo>({
  mail: '',
  firstName: '',
  lastName: '',
});

const formRules = computed(() => ({
  mail: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  firstName: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
  lastName: [
    {
      required: true,
      message: t('GENERAL.FIELD_REQUIRED'),
    },
  ],
}));
const { validate, validateInfos, resetFields } = useForm(form, formRules);

const { filterMail, activeContactList, handleAddContactListEmail } = useContactList();
const editing = ref(false);

async function onAddContactListEmail() {
  try {
    await validate();
  } catch (error) {
    return;
  }
  const uuid = route.params.id?.toString() || activeContactList.value.uuid?.toString();
  const result = await handleAddContactListEmail(uuid, form);
  if (result) {
    editing.value = false;
    initFormData();
    emits('refresh');
  }
}

function initFormData() {
  form.mail = '';
  form.firstName = '';
  form.lastName = '';
  resetFields();
}
</script>
<style lang="less">
.contact-list-detail-header {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding-bottom: 28px;
  width: 100%;
  gap: 16px;

  &__rule-form {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }

  &__title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }

  &__action {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    .ls-button {
      padding: 0px 20px;
      min-width: 151px;
      height: 44px;
      background: #f3f3f7;
      border-radius: 8px;
      color: #007aff;
    }

    .ls-filled {
      background-color: #007aff;
      color: #f3f3f7;
    }
  }

  &__action-input {
    width: 380px;
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

  .ls-save {
    height: 44px !important;
    background-color: #007aff;
    color: #fff;
    font-size: 14px;
  }

  .ls-save:disabled,
  .ls-save:disabled:hover {
    background-color: #007aff;
    color: #fff;
    opacity: 0.3;
  }

  .ls-cancel {
    background: var(--lin-share-branding-color-primary-50, #f2f8ff);
    border: none;
    min-width: 50px !important;
  }
}
</style>
