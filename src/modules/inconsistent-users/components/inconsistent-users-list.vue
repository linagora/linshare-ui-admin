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
          <a-button class="multipselectedUsersle-delete-button" type="primary" danger @click="confirmDelete">
            {{ t('GENERAL.DELETE') }}</a-button
          >
        </div>
      </div>
    </a-card>
  </div>

  <a-table
    :columns="columns"
    :data-source="list"
    :loading="status"
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
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { useDomainStore } from '@/modules/domain/store';
import useInconsistentUsers from '@/modules/inconsistent-users/hooks/useInconsistentUsers';
import { getInconsistentUsersList, deleteUser } from '@/modules/inconsistent-users/services/inconsistent-users-api';
import useNotification from '@/core/hooks/useNotification';
import User from '@/modules/user/types/User';
import { APIError } from '@/core/types/APIError';

const { t } = useI18n();
const { fetchInconsistentUsersList, status, list } = useInconsistentUsers();
const domainStore = useDomainStore();
const { confirmModal } = useNotification();

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
  },
  {
    dataIndex: 'lastName',
    key: 'lastName',
    title: t('INCONSISTENT_USERS.COLUMNS.LASTNAME'),
  },
  {
    dataIndex: 'email',
    key: 'email',
    title: t('INCONSISTENT_USERS.COLUMNS.EMAIL'),
  },
  {
    dataIndex: 'domain',
    key: 'domain',
    title: t('GENERAL.DOMAIN'),
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

onMounted(fetchInconsistentUsersList);
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
