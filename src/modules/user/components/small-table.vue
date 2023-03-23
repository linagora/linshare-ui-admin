<template>
  <div v-if="checkedUsers.length > 0">
    <a-card class="action-card">
      <div class="bulk-actions">
        <h3>
          {{
            t('USERS.MANAGE_USERS.SELECTED_USERS_NUMBER', {
              number: checkedUsers.length,
            })
          }}
        </h3>
        <br />
        <div>
          <a-button v-if="checkAll === false" class="select-all" type="primary" @click="selectOrUnselectAll">{{
            t('USERS.MANAGE_USERS.SELECT_ALL')
          }}</a-button>
          <a-button v-else class="select-all" type="primary" @click="selectOrUnselectAll">{{
            t('USERS.MANAGE_USERS.UNSELECT_ALL')
          }}</a-button>
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
  <div v-for="(user, index) in list" :key="index + '_user_guest_small_table'" class="list-item">
    <a-card>
      <div class="checkbox">
        <a-checkbox :key="checkBox.key" :indeterminate="checkAll" @change="checkedUser(user)"></a-checkbox>
      </div>
      <a-row :gutter="20">
        <a-col :xs="12" :sm="6">
          <div class="info-block">
            <div class="info-block__name">
              <router-link :to="{ name: 'UserDetail', params: { id: user.uuid } }">
                <span class="elipsis-name" :title="user.firstName + ' ' + user.lastName"
                  ><a-avatar class="info-block__avatar" shape="circle" :size="56">
                    {{ user.firstName.charAt(0) }} </a-avatar
                  >{{ user.firstName }} {{ user.lastName }}</span
                >
              </router-link>
            </div>
          </div>
          <LockOutlined v-if="user.locked === true" class="locked" />
        </a-col>
        <a-col :xs="12" :sm="8">
          <div class="info-block">
            <div class="info-block__title">
              {{ t('USERS.DETAIL_USER.MAIL') }}
            </div>
            <div class="info-block">
              {{ user.mail }}
            </div>
            <div class="info-block__title">
              {{ t('USERS.DETAIL_USER.ACCOUNT_TYPE') }}
            </div>
            <div class="info-block">
              {{ user.accountType }}
            </div>
            <div class="info-block__title">
              {{ t('USERS.DETAIL_USER.ROLE') }}
            </div>
            <div class="info-block">
              {{ user.role }}
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="7">
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.CREATION_DATE') }}
            </div>
            <div class="info-block__value">
              {{ $d(user.creationDate as any, 'mediumDate') }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.UPDATE_TIME_RELATIVE') }}
            </div>
            <div class="info-block__value" :title="$d(user.modificationDate as any, 'mediumDate')">
              {{ useRelativeTime(user.modificationDate as any)?.value }}
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useUsersList from '@/modules/user/hooks/useUsersList';
import { LockOutlined, UnlockOutlined, DeleteFilled } from '@ant-design/icons-vue';
import useNotification from '@/core/hooks/useNotification';
import User from '../types/User';
import { message } from 'ant-design-vue';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { deleteUser, updateUser } from '@/modules/user/services/user-api';
import { APIError } from '@/core/types/APIError';

const { t } = useI18n();
const checkedUsers = ref<User[]>([]);
const { list, handleTableChange, pagination } = useUsersList();
const { confirmModal } = useNotification();
const checkAll = ref(false);
const checkBox = reactive({
  key: 1,
});

function checkedUser(user: User) {
  if (checkedUsers.value.includes(user)) {
    let index = checkedUsers.value.indexOf(user);
    if (index > -1) {
      checkedUsers.value.splice(index, 1);
    }
  } else {
    checkedUsers.value.push(user);
  }
}

async function multipleUserDeltion() {
  try {
    for (let i = 0; i < checkedUsers.value.length; i++) {
      await deleteUser(checkedUsers.value[i]);
    }
    message.success(
      t('USERS.MANAGE_USERS.MULTIPLE_DELETE', {
        number: checkedUsers.value.length,
      })
    );
    checkedUsers.value = [];
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
    for (let i = 0; i < checkedUsers.value.length; i++) {
      await updateUser({
        ...checkedUsers.value[i],
        locked: false,
      });
    }
    message.success(
      t('USERS.MANAGE_USERS.SELECTED_USERS_UNLOCK', {
        number: checkedUsers.value.length,
      })
    );
    checkBox.key += 1;
    checkedUsers.value = [];
    checkAll.value = false;
    handleTableChange();
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function selectOrUnselectAll() {
  if (checkAll.value === false) {
    checkedUsers.value = [];
    checkAll.value = true;
    for (let i = 0; i < pagination.pageSize * pagination.current; i++) {
      checkedUsers.value.push(list.value[i]);
    }
  } else {
    checkAll.value = false;
    checkedUsers.value = [];
    checkBox.key += 1;
  }
}

function isLockedUser() {
  for (const user in checkedUsers.value) {
    if (checkedUsers.value[user].locked === true) {
      return true;
    }
  }
}

handleTableChange();
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.delete_text {
  color: @error-color;
}

.elipsis-name {
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
.bulk-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.multiple-delete-button {
  margin-right: 10px;
  margin-left: 10px;
}
.action-card {
  margin-top: 10px;
}
.list-item {
  cursor: pointer;
  margin: 15px 0px;

  .info-block {
    padding: 5px;
    margin-bottom: 20px;

    &__name {
      font-size: 14px;
      font-weight: 600;
    }
    &__avatar {
      background-color: @primary-color;
      color: @component-background;
      margin-right: 5px;
    }

    &__title {
      color: @text-color-secondary;
    }

    &__value {
      display: flex;
    }
  }
  .locked {
    color: @primary-color;
    margin-left: 50%;
  }
  .checkbox {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
