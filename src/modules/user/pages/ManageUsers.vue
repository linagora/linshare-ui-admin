<template>
  <div class="manage-users">
    <h1 class="title">{{ $t('USERS.MANAGE_USERS.TITLE')}}</h1>
    <h3 class="subtitle">{{ $t('USERS.MANAGE_USERS.SUBTITLE') }}</h3>
    <div>
      <a-alert
        message="Users"
        type="info"
        class="alert-message"
        closable
      >
        <template #description>
          <div>
            <div>This view allows you to find different domain's users. You can change roles, firstname, lastname and default languages, as well as upload permissions</div>
            <div class='alert-message-in-description'>Operation</div>
            <div>You should enter an user information (ex: email) in the search field.</div>
            <div>Click on the user to access to his profile.</div>
          </div>
        </template>
      </a-alert>
    </div>

    <SearchForm @search="fetchUsers"/>

    <div class="users-list">
      <LargeTable :data="data.list" :pageSize="pageSize"/>
      <SmallTable :data="data.list" :pageSize="pageSize"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';
import User from '@/modules/user/type/User';
import UserAPIClient, { FindUserPayload } from '@/modules/user/services/UserAPIClient';
import LargeTable from '@/modules/user/components/LargeTable.vue';
import SmallTable from '@/modules/user/components/SmallTable.vue';
import SearchForm from '@/modules/user/components/SearchForm.vue';

export default defineComponent({
  name: 'ManageUsers',
  components: {
    LargeTable,
    SmallTable,
    SearchForm
  },
  setup () {
    const data = reactive({
      list: [] as User[]
    });
    const pageSize = 5;

    async function fetchUsers (payload: FindUserPayload, config?: object) {
      try {
        const users = await UserAPIClient.getUsers(payload, config);
        data.list = users;
      } catch (error) {
        data.list = [];
        message.error(error.message || 'Something went wrong. Please try again later!');
      }
    }

    return {
      data,
      pageSize,
      fetchUsers
    };
  }
});
</script>

<style lang='less' scoped>
  @import '@/assets/styles/variables';

  .manage-users {
    padding: 0px 30px;

    .title {
      font-weight: 600;
      font-size: 24px;
      color: #1B4157;
    }

    .subtitle {
      font-weight: 400;
      color: #999;
    }

    .alert-message {
      margin-top: 30px;
    }

    .alert-message-in-description {
      display: block;
      margin-top: 10px;
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
    }

    .users-list {
      margin-top: 40px;
    }
  }
</style>
