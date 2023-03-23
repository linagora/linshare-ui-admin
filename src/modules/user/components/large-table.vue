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
            <DeleteFilled /> {{ t('USERS.MANAGE_USERS.SELECTED_USERS_DELETE') }}</a-button
          >
          <a-button v-if="isLockedUser()" type="primary" ghost @click="multipleUserUnlock"
            ><UnlockOutlined /> {{ t('USERS.DETAIL_USER.UNLOCK') }}</a-button
          >
        </div>
      </div>
    </a-card>
  </div>
  <a-table
    class="user-table"
    :columns="columns"
    :data-source="list"
    row-key="uuid"
    :pagination="false"
    :loading="loading"
    :row-selection="{ selectedRowKeys: selectedUsers.userKey, onChange: onSelectChange }"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'user'">
        <router-link :to="{ name: 'UserDetail', params: { id: record.uuid } }">
          <div class="user-infos">
            <div>
              <a-avatar shape="circle" :size="46" class="profile-avatar">
                <span> {{ record.firstName.charAt(0) }}</span>
              </a-avatar>
            </div>

            <div>
              <span class="name"
                >{{ record.firstName }} {{ record.lastName }}
                <LockOutlined v-if="record.locked === true" :style="{ color: '#007AFF' }"
              /></span>
              <br />
              <span class="mail">{{ record.mail }}</span>
            </div>
          </div>
        </router-link>
      </template>
      <template v-else-if="column.key === 'type'">
        <a-tag color="blue">
          {{ $t(`USERS.DETAIL_USER.TYPE_${text}`) }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'role'">
        <a-tag color="purple">
          {{ $t(`USERS.DETAIL_USER.ROLE_${text}`) }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'domain'">
        <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: record.domain.uuid } }">
          <span class="item__domain">{{ text }}</span>
        </router-link>
      </template>

      <template v-else-if="column.key === 'modificationDate'">
        <span :title="$d(text, 'mediumDate')">{{ relativeDate(record.modificationDate) }}</span>
      </template>

      <template v-else-if="column.key === 'creationDate'">
        <span>{{ $d(text, 'mediumDate') }}</span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useUsersList from '@/modules/user/hooks/useUsersList';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import User from '../types/User';
import { LockOutlined, UnlockOutlined, DeleteFilled } from '@ant-design/icons-vue';
import useNotification from '@/core/hooks/useNotification';
import { message } from 'ant-design-vue';
import { deleteUser, updateUser } from '@/modules/user/services/user-api';
import { APIError } from '@/core/types/APIError';

const { loading, list, handleTableChange } = useUsersList();
const { t } = useI18n();
const { confirmModal } = useNotification();
const selectedUsers = reactive({
  users: [] as User[],
  userKey: [] as User[],
});

function relativeDate(date: number) {
  const relativeTime = useRelativeTime(date);
  return relativeTime?.value;
}

const onSelectChange = (selectedRowKeys: User[], selectedRows: User[]) => {
  selectedUsers.userKey = selectedRowKeys;
  selectedUsers.users = selectedRows;
};

async function multipleUserDeltion() {
  try {
    for (let i = 0; i < selectedUsers.users.length; i++) {
      await deleteUser(selectedUsers.users[i]);
    }
    message.success(
      t('USERS.MANAGE_USERS.MULTIPLE_DELETE', {
        number: selectedUsers.users.length,
      })
    );
    selectedUsers.users = [];
    selectedUsers.userKey = [];
    handleTableChange();
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function confirmDelete() {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('USERS.MANAGE_USERS.MULTIPLE_DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: multipleUserDeltion,
  });
}

async function multipleUserUnlock() {
  try {
    for (let i = 0; i < selectedUsers.users.length; i++) {
      await updateUser({
        ...selectedUsers.users[i],
        locked: false,
      });
    }
    message.success(
      t('USERS.MANAGE_USERS.SELECTED_USERS_UNLOCK', {
        number: selectedUsers.users.length,
      })
    );
    selectedUsers.users = [];
    selectedUsers.userKey = [];
    handleTableChange();
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function isLockedUser() {
  for (const user in selectedUsers.users) {
    if (selectedUsers.users[user].locked === true) {
      return true;
    }
  }
}

const columns = computed(() => [
  {
    title: t('NAVIGATOR.USERS'),
    key: 'user',
  },
  {
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    dataIndex: ['domain', 'name'],
    width: 200,
    key: 'domain',
  },
  {
    title: t('USERS.DETAIL_USER.ACCOUNT_TYPE'),
    dataIndex: 'accountType',
    align: 'center',
    width: 200,
    key: 'type',
  },
  {
    title: t('USERS.DETAIL_USER.ROLE'),
    dataIndex: 'role',
    align: 'center',
    width: 200,
    key: 'role',
  },
  {
    title: t('GENERAL.UPDATE_TIME_RELATIVE'),
    dataIndex: 'modificationDate',
    width: 200,
    key: 'modificationDate',
  },
  {
    title: t('GENERAL.CREATE_AT'),
    dataIndex: 'creationDate',
    width: 200,
    key: 'creationDate',
  },
]);

await handleTableChange();
</script>

<style lang="less" scoped>
a:hover .user-infos .name {
  text-decoration: underline;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: @text-color;
}
.mail {
  color: @text-color;
}

.user-infos {
  display: flex;
}

.profile-avatar {
  background-color: @primary-color;
  color: @component-background;
  margin-right: 10px;
}
.user-table {
  margin-top: 10px;
}
.bulk-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.multiple-delete-button {
  margin-right: 15px;
}
</style>
