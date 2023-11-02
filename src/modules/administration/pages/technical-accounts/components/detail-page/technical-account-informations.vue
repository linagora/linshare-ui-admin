<template>
  <div class="technical-account-informations">
    <span class="title">
      {{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.USER_INFORMATIONS_SUB_TITLE') }}
    </span>
    <a-form :validate-messages="validateMessages" :model="technicalAccountDetails">
      <div class="technical-account-informations__form">
        <a-form-item class="ls-form-title" :label="$t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.USER_NAME')">
          <a-input v-model:value="technicalAccountDetails.name" class="ls-input"></a-input>
        </a-form-item>
        <a-form-item
          class="ls-form-title"
          :label="$t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.EMAIL')"
          :rules="[{ type: 'email' }]"
          :name="['mail']"
        >
          <a-input v-model:value="technicalAccountDetails.mail" class="ls-input"></a-input>
        </a-form-item>
        <a-form-item class="ls-form-title">
          <div class="account-status">
            <span class="account-status__title">{{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.STATUS') }}</span>
            <a-switch v-model:checked="technicalAccountDetails.enable" class="ls-switch" />
          </div>
        </a-form-item>
      </div>
    </a-form>

    <div class="separator"></div>
    <div v-if="technicalAccountDetails.locked" class="technical-account-locked__actions">
      <div class="red">
        {{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.LOCKED_TITLE') }}
      </div>
      <ls-button class="ant-btn ls-button--info config-menu" color="info" @click="onClickToggleLockTechnicalAccount">
        <unlock-icon class="icon"></unlock-icon>
        {{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.UNLOCK') }}
      </ls-button>
    </div>
    <div class="technical-account-informations__actions">
      <a-button
        :disabled="loading"
        type="primary"
        class="ls-button ls-filled"
        @click="updateTechnicalAccountInformations"
      >
        <a-spin v-if="loading"></a-spin>
        <span v-else>{{ $t('GENERAL.SAVE') }}</span>
      </a-button>
      <a-button class="ls-button ls-cancel" @click="getAccountInformation">
        {{ $t('GENERAL.CANCEL') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import useTechnicalAccount from '../../hooks/useTechnicalAccount';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import UnlockIcon from '@/core/components/icons/unlock-icon.vue';

// props
const emits = defineEmits(['refresh', 'close']);
// composable
const router = useRouter();
const { technicalAccountDetails, loading, getTechnicalAccountDetailInformation, handleUpdateTechnicalAccount } =
  useTechnicalAccount();
const { t } = useI18n();

const validateMessages = {
  types: {
    email: t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.EMAIL_VALIDATION'),
  },
};

async function onClickToggleLockTechnicalAccount() {
  technicalAccountDetails.locked = !technicalAccountDetails.locked;

  const result = await handleUpdateTechnicalAccount(technicalAccountDetails);
  if (result) {
    emits('refresh');
    onCloseModal();
  }
}

async function onCloseModal() {
  emits('close');
}

async function updateTechnicalAccountInformations() {
  await handleUpdateTechnicalAccount(technicalAccountDetails);
}

function getAccountInformation() {
  getTechnicalAccountDetailInformation(router.currentRoute.value.params.id);
}
getAccountInformation();
</script>
<style lang="less">
.technical-account-informations {
  height: 100%;

  .title {
    color: var(--neutral-colors-color-text-title, #1b1d29);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 50px;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 50%;
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

  .red {
    color: #eb0707;
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

  .ls-form-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
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

  .ant-col {
    min-height: unset;
  }
  .account-status {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    &__title {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      color: #434657;
      gap: 16px;
    }
  }
}
.separator {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 10px 0;
}

.technical-account-locked {
  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .config-menu {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      height: 38px;
      gap: 4px;
      padding: 7px;
    }

    .config-menu .action {
      text-align: left;
    }

    .desktop {
      display: none;
    }
  }
}

@media (min-width: 992px) {
  .technical-account-locked {
    .action {
      .icon {
        margin-right: 8px;
      }

      .desktop {
        display: flex;
      }
    }
  }
}
</style>
