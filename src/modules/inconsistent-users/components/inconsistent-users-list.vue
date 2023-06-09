<template>
  <div v-if="selectedUsers.users.length > 0">
    <a-card>
      <div class="bulk-actions">
        <h3>
          {{
            t('USERS.MANAGE_USERS.SELECTED_USERS_NUMBER', {
              number: selectedUsers.users.length,
            })
          }}
        </h3>
        <div>
          <a-button class="multiple-delete-button" type="primary" danger @click="confirmDelete">
            {{ t('GENERAL.DELETE') }}</a-button
          >
          <a-button type="primary" ghost @click="showFilterModal = true">{{ t('GENERAL.MIGRATE') }}</a-button>
        </div>
      </div>
    </a-card>
  </div>

  <inconsistent-users-migration-modal
    :visible="showFilterModal"
    :selected-users="selectedUsers.users"
    @close="onCloseMigrationModal"
    @refresh="onRefreshSelectedData"
  ></inconsistent-users-migration-modal>

  <a-table
    :columns="columns"
    :data-source="filteredListByPage"
    :loading="loading"
    :pagination="false"
    row-key="uuid"
    :row-selection="{ selectedRowKeys: selectedUsers.userKey, onChange: onSelectChange }"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'number'">
        <span class="name">{{ index + 1 }}</span>
      </template>

      <template v-if="column.key === 'firstName'">
        <div class="inconsistent-users">
          <span class="name">{{ record.firstName }}</span>
        </div>
      </template>

      <template v-if="column.key === 'lastName'">
        <div class="inconsistent-users">
          <span class="name">{{ record.lastName }}</span>
        </div>
      </template>

      <template v-if="column.key === 'email'">
        <span class="name">{{ record.mail }}</span>
      </template>

      <template v-if="column.key === 'domain'">
        <span class="name">{{ record.domainName }}</span>
      </template>

      <template v-if="column.key === 'domainId'">
        <span class="name">{{ record.domain }}</span>
      </template>

      <template v-if="column.key === 'role'">
        <span class="name">{{ record.role }}</span>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import useInconsistentUsers from '@/modules/inconsistent-users/hooks/useInconsistentUsers';
import InconsistentUsersMigrationModal from './inconsistent-users-migration-modal.vue';
import { deleteUser } from '@/modules/inconsistent-users/services/inconsistent-users-api';
import useNotification from '@/core/hooks/useNotification';
import User from '@/modules/user/types/User';
import { APIError } from '@/core/types/APIError';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { fetchInconsistentUsersList, resetFilters, filteredListByPage, loading, pagination } = useInconsistentUsers();
const { confirmModal } = useNotification();
const { currentRoute } = useRouter();

const columns = computed(() => [
  {
    dataIndex: 'no',
    key: 'number',
    title: t('INCONSISTENT_USERS.COLUMNS.NUMBER_COL'),
  },
  {
    dataIndex: 'firstName',
    key: 'firstName',
    title: t('INCONSISTENT_USERS.COLUMNS.FIRSTNAME'),
    sorter: (a: InconsistentUsers, b: InconsistentUsers) => a.firstName.localeCompare(b.firstName),
  },
  {
    dataIndex: 'lastName',
    key: 'lastName',
    title: t('INCONSISTENT_USERS.COLUMNS.LASTNAME'),
    sorter: (a: InconsistentUsers, b: InconsistentUsers) => a.lastName.localeCompare(b.lastName),
  },
  {
    dataIndex: 'email',
    key: 'email',
    title: t('INCONSISTENT_USERS.COLUMNS.EMAIL'),
    sorter: (a: InconsistentUsers, b: InconsistentUsers) => a.mail.localeCompare(b.mail),
  },
  {
    dataIndex: 'domain',
    key: 'domain',
    title: t('GENERAL.DOMAIN'),
    sorter: (a: InconsistentUsers, b: InconsistentUsers) => a.domainName.localeCompare(b.domainName),
  },
  {
    dataIndex: 'domainId',
    key: 'domainId',
    title: t('INCONSISTENT_USERS.COLUMNS.DOMAIN_ID'),
  },
  {
    dataIndex: 'role',
    key: 'role',
    title: t('INCONSISTENT_USERS.COLUMNS.ROLE'),
  },
]);

const selectedUsers = reactive({
  users: [] as User[],
  userKey: [] as User[],
});

const showFilterModal = ref(false);

const onSelectChange = (selectedRowKeys: User[], selectedRows: User[]) => {
  selectedUsers.userKey = selectedRowKeys;
  selectedUsers.users = selectedRows;
};

function confirmDelete() {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('INCONSISTENT_USERS.CONFIRM_DELETE_FORM.PARAGRAPH'),
    okText: t('GENERAL.DELETE'),
    onOk: multipleUserDeletion,
  });
}

async function multipleUserDeletion() {
  try {
    const deletePromises = selectedUsers.users.map((user) => {
      return deleteUser(user);
    });
    if (!deletePromises) {
      return;
    }
    const responses = await Promise.all(deletePromises);

    if (responses) {
      message.success(
        t('USERS.MANAGE_USERS.MULTIPLE_DELETE', {
          number: selectedUsers.users.length,
        })
      );
      selectedUsers.userKey = [];
      selectedUsers.users = [];
      pagination.current--;
      fetchInconsistentUsersList();

      return true;
    }
    return false;
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function onCloseMigrationModal() {
  showFilterModal.value = false;
}

function onRefreshSelectedData() {
  selectedUsers.userKey = [];
  selectedUsers.users = [];
  onCloseMigrationModal();
  fetchInconsistentUsersList();
  pagination.current = 1;
}

onMounted(fetchInconsistentUsersList);

watch(currentRoute, () => {
  resetFilters();
});
</script>

<style lang="less" scoped>
.inconsistent-users {
  display: flex;
  flex-direction: row;

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: @text-color;
  }
}

.bulk-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.multiple-delete-button {
  margin-right: 15px;
}

:deep(.ant-tag).node-type {
  border: 0px;
  background: @primary-1;
  color: @primary-color;
  text-transform: uppercase;
}
</style>
