<template>
  <a-card flat :bordered="false" class="delete-contact-card">
    <span class="delete-contact-card__icon">
      <DeleteIcon width="28" height="28" />
    </span>
    <div class="delete-contact-card__content">
      <strong>{{ $t('CONTACT_LIST.DELETE_CONTACT') }}</strong>
      <span v-html="$t('CONTACT_LIST.DELETE_MAIL_DESCRIPTION', { mail: deletedEmail })"></span>
    </div>
    <div class="delete-contact-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.CANCEL') }}</a-button>
      <a-button class="ls-button ls-save" type="primary" danger @click="onConfirmDelete">
        <a-spin v-if="loading" />
        <span v-else>{{ $t('CONTACT_LIST.YES_DELETE') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import DeleteIcon from '@/core/components/icons/delete-icon.vue';
import useContactList from '../../hooks/useContactList';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

// composable
const route = useRoute();
const { t } = useI18n();
const { loading, handleDeleteContactListEmail, activeContactList, activeMail } = useContactList();

const emits = defineEmits(['close', 'refresh', 'deleted']);

const deletedEmail = computed(() => {
  return `${activeMail.value?.firstName} ${activeMail.value?.lastName} (${activeMail.value?.mail})`;
});

function onCloseModal() {
  emits('close');
}
async function onConfirmDelete() {
  const uuid = route.params.id?.toString() || activeContactList.value.uuid?.toString();

  const result = await handleDeleteContactListEmail(uuid, activeMail.value);
  if (result) {
    message.success(t('CONTACT_LIST.DELETE_CONTACT_MODAL.DELETE_SUCCESS'));
    emits('deleted');
    emits('close');
  }
}
</script>
<style lang="less">
.delete-contact-card {
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    border: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;

    strong {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
      color: #434657;
    }

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #6d7885;
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ea3c3c;
    width: 68px;
    height: 68px;
    background: #fbecec;
    border-radius: 16px;
    margin: 0 auto;
    margin-bottom: 24px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;

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
}
</style>
