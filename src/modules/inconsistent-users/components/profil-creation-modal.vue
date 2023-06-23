<template>
  <a-card flat :bordered="false" class="profil-creation-card">
    <span class="profil-creation-card__icon">
      <CreationIcon width="28" height="28" />
    </span>
    <div class="profil-creation-card__content">
      <strong>{{ $t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.CREATION_MODAL_TITLE') }}</strong>
      <span>{{ $t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.CREATION_MODAL_DESCRIPTION') }}</span>
    </div>
    <div class="profil-creation-card__actions">
      <a-button class="ls-button ls-cancel" type="primary" @click="onCloseModal">{{ $t('GENERAL.NO') }}</a-button>
      <a-button class="ls-button ls-save" type="primary" info @click="onConfirm">
        <span>{{ $t('GENERAL.YES') }}</span>
      </a-button>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import CreationIcon from '@/core/components/icons/creation-icon.vue';
import useUsersDiagnostic from '../hooks/useUsersDiagnostic';

const { DiagnosticUserCreation, list } = useUsersDiagnostic();

const emits = defineEmits(['close', 'refresh']);

function onCloseModal() {
  emits('close');
}
async function onConfirm() {
  await DiagnosticUserCreation();
  emits('close');
  list.value = [];
}
</script>
<style lang="less">
.profil-creation-card {
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
    color: #007aff;
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
