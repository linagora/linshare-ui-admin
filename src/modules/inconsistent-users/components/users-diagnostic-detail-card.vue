<template>
  <inconsistent-users-migration-modal
    :visible="showMigrationModal"
    :selected-users="userToMigrate"
    @close="MigrationModalLogic"
    @refresh="refresh"
  ></inconsistent-users-migration-modal>

  <div class="detail-card">
    <a-form class="form">
      <a-form-item
        ><a-switch v-model:checked="selectedUser.canUpload" class="ls-switch" />
        {{ $t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.UPLOAD_PERMISSION') }}
      </a-form-item>
      <a-form-item
        ><a-switch v-model:checked="selectedUser.canCreateGuest" class="ls-switch" />
        {{ $t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.GUEST_PERMISSION') }}
      </a-form-item>
      <a-form-item class="ls-form-title" :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.ROLE')">
        <a-select v-model:value="selectedUser.role" class="ls-input" :bordered="false">
          <a-select-option value="SIMPLE">
            {{ $t('USERS.DETAIL_USER.ROLE_SIMPLE') }}
          </a-select-option>
          <a-select-option value="ADMIN">
            {{ $t('USERS.DETAIL_USER.ROLE_ADMIN') }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="ls-form-title" :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.FIRST_NAME')">
        <a-input v-model:value="selectedUser.firstName" class="ls-input" :allow-clear="true" />
      </a-form-item>
      <a-form-item class="ls-form-title" :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.LAST_NAME')">
        <a-input v-model:value="selectedUser.lastName" class="ls-input" :allow-clear="true" />
      </a-form-item>
      <a-form-item class="ls-form-title" :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.DEFAULT_LANGUAGE')">
        <a-select v-model:value="selectedUser.locale" class="ls-input" :bordered="false">
          <a-select-option v-for="option in defaultLanguageOptions" :key="option" :value="option">
            {{ $t(`LOCALE.${option}`) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="ls-form-title" :label="$t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.NOTIFICATION_LANGUAGE')">
        <a-select v-model:value="selectedUser.externalMailLocale" class="ls-input" :bordered="false">
          <a-select-option v-for="option in languageNotificationOptions" :key="option" :value="option">
            {{ $t(`LOCALE.${option}`) }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <div class="system-informations-section">
      <div class="system-informations">
        <h3 class="section-title">{{ $t('MIME_POLICIES.SYSTEM_INFORMATIONS') }}</h3>
        <div class="info-block">
          <StatusIcon class="system-icon"></StatusIcon>
          <div>
            <div class="title">{{ $t('INCONSISTENT_USERS.MIGRATE_USERS_CARD.STATUS') }}</div>
            <div class="value">{{ $t(`USERS.DETAIL_USER.TYPE_${selectedUser.accountType}`) }}</div>
          </div>
        </div>
        <div class="info-block">
          <CalendarIcon class="system-icon"></CalendarIcon>
          <div>
            <div class="title">{{ $t('GENERAL.CREATION_DATE') }}</div>
            <div v-if="selectedUser.creationDate" class="value">{{ $d(selectedUser.creationDate, 'mediumDate') }}</div>
          </div>
        </div>
        <div class="info-block">
          <CalendarIcon class="system-icon"></CalendarIcon>
          <div>
            <div class="title">{{ $t('GENERAL.MODIFICATION_DATE') }}</div>
            <div v-if="selectedUser.modificationDate" class="value">
              {{ $d(selectedUser.modificationDate, 'mediumDate') }}
            </div>
          </div>
        </div>
        <div class="info-block">
          <GlobeIcon class="system-icon"></GlobeIcon>
          <div>
            <div class="title">{{ $t('GENERAL.DOMAIN') }}</div>
            <div class="value">
              <div class="value">{{ selectedUser.domainName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <a-button type="primary" class="ls-button">
        <a-spin v-if="loading" />
        <span v-else @click="saveDiagnosticUserModification(selectedUser), handleTableChange(selectedUser.mail)">{{
          $t('GENERAL.SAVE')
        }}</span>
      </a-button>
      <a-button class="ls-button ls-reset" @click="getDiagnosticUserInformations">
        {{ $t('GENERAL.RESET') }}
      </a-button>
      <a-button class="ls-button ls-migrate" @click="MigrationModalLogic">
        {{ $t('GENERAL.MIGRATE') }}
      </a-button>
      <a-button class="ls-button ls-delete" @click="confirmDelete(selectedUser)">
        {{ $t('GENERAL.DELETE') }}
      </a-button>
    </div>
  </div>
  <userDiagnosticQuotaCard></userDiagnosticQuotaCard>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import CalendarIcon from '@/core/components/icons/calendar-icon.vue';
import StatusIcon from '@/core/components/icons/status-icon.vue';
import useUsersDiagnostic from '@/modules/inconsistent-users/hooks/useUsersDiagnostic';
import InconsistentUsersMigrationModal from './inconsistent-users-migration-modal.vue';
import { InconsistentUsers } from '../types/InconsistentUsers';
import useNotification from '@/core/hooks/useNotification';
import { useI18n } from 'vue-i18n';
import userDiagnosticQuotaCard from '../components/user-diagnostic-quota.vue';

const {
  selectedUser,
  getDiagnosticUserInformations,
  loading,
  diagnoticUserDeletion,
  saveDiagnosticUserModification,
  handleTableChange,
} = useUsersDiagnostic();
const defaultLanguageOptions = ['ENGLISH', 'FRENCH', 'RUSSIAN', 'VIETNAMESE'];
const languageNotificationOptions = ['ENGLISH', 'FRENCH', 'RUSSIAN'];
const showMigrationModal = ref(false);
const { t } = useI18n();
const { confirmModal } = useNotification();

const userToMigrate = ref([] as InconsistentUsers[]);

function refresh() {
  handleTableChange(selectedUser.value.mail);
}

function MigrationModalLogic() {
  showMigrationModal.value === false
    ? ((showMigrationModal.value = true),
      (userToMigrate.value = [
        {
          uuid: selectedUser.value.uuid,
          creationDate: selectedUser.value.creationDate,
          modificationDate: selectedUser.value.modificationDate,
          locale: selectedUser.value.locale,
          externalMailLocale: selectedUser.value.externalMailLocale,
          domain: selectedUser.value.domain,
          domainName: selectedUser.value.domainName,
          firstName: selectedUser.value.firstName,
          lastName: selectedUser.value.lastName,
          mail: selectedUser.value.mail,
          role: selectedUser.value.role,
          canUpload: selectedUser.value.canUpload,
          canCreateGuest: selectedUser.value.canCreateGuest,
          accountType: selectedUser.value.accountType,
        },
      ]))
    : (showMigrationModal.value = false),
    refresh();
}

function confirmDelete(user: InconsistentUsers) {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('USERS.DETAIL_USER.CONFIRM_DELETE'),
    okText: t('GENERAL.DELETE'),
    onOk: () => diagnoticUserDeletion(user),
  });
}
</script>

<style lang="less">
.detail-card {
  margin-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background-color: #fafafa;
  padding: 20px;
  border-radius: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 12px;
}
.ls-switch {
  gap: 4px;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: #434657;
}

.ls-form-title {
  display: flex;
  flex-direction: column;
}

.ant-form-item-label {
  text-align: left;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.01em;
  color: #6d7885;
  margin-bottom: 5px;
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

.system-informations-section {
  margin-top: 25%;
}

.system-informations {
  border-radius: 12px;
  background-color: #f3f3f7;
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

.system-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: #6d7885;
}

.section-title {
  margin-bottom: 15px;
  color: #434657;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin-top: 20px;

  .ls-button {
    padding: 0px 20px;
    min-width: 88px;
    height: 44px;
    border-radius: 8px;
  }

  .ls-filled {
    background-color: #007aff;
    color: #f3f3f7;

    .ant-spin {
      color: #f3f3f7;
    }

    .ant-spin-dot-item {
      background-color: #f3f3f7;
    }
  }

  .ls-delete {
    color: #ea3c3c;
  }

  .ls-reset {
    color: #007aff;
  }

  .ls-migrate {
    color: #007aff;
  }
}
</style>
