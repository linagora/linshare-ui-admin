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
            <div>{{ $t('USERS.MANAGE_USERS.DESCRIPTION') }}</div>
            <div class='alert-message-in-description'>{{ $t('USERS.MANAGE_USERS.OPERATION') }}</div>
            <div>{{ $t('USERS.MANAGE_USERS.SEARCH_GUIDE') }}</div>
            <div>{{ $t('USERS.MANAGE_USERS.NAVIGATE_GUIDE') }}</div>
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
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import store from '@/core/store';
import User from '@/modules/user/type/User';
import Domain from '@/modules/domain/type/Domain';
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
  async setup () {
    await store.dispatch('Domain/fetchDomains');

    const data = reactive({
      list: [] as User[],
      domains: store.getters['Domain/getDomains']
    });
    const pageSize = 5;

    async function fetchUsers (payload: FindUserPayload, config?: object) {
      try {
        const users = await UserAPIClient.getUsers(payload, config);
        data.list = users.map(user => {
          const domain = data.domains.find((item: Domain) => item.identifier === user.domain);
          user.domain = domain ? domain.label : user.domain;
          return user;
        });
      } catch (error) {
        data.list = [];
        message.error(error.message || useI18n().t('ERRORS.COMMON_MESSAGE'));
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
