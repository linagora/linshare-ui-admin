<template>
  <div class="manage-users">
    <PageTitle
      :title="$t('USERS.MANAGE_USERS.TITLE')"
      :subtitle="$t('USERS.MANAGE_USERS.SUBTITLE')"
    >
      <template #helperContent>
        <div class='alert-message-in-description'>{{ $t('NAVIGATOR.USERS') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.DESCRIPTION') }}</div>
        <div class='alert-message-in-description'>{{ $t('USERS.MANAGE_USERS.OPERATION') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.SEARCH_GUIDE') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.NAVIGATE_GUIDE') }}</div>
      </template>
    </PageTitle>

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
import PageTitle from '@/core/components/PageTitle.vue';
import LargeTable from '@/modules/user/components/LargeTable.vue';
import SmallTable from '@/modules/user/components/SmallTable.vue';
import SearchForm from '@/modules/user/components/SearchForm.vue';

export default defineComponent({
  name: 'ManageUsers',
  components: {
    LargeTable,
    SmallTable,
    SearchForm,
    PageTitle
  },
  async setup () {
    const { t } = useI18n();
    const data = reactive({
      list: [] as User[],
      domains: store.getters['Domain/getDomains']
    });
    const pageSize = 5;

    await store.dispatch('Domain/fetchDomains');

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
        message.error(error.message || t('ERRORS.COMMON_MESSAGE'));
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
    .users-list {
      margin-top: 40px;
    }

    .alert-message-in-description {
      display: block;
      margin-top: 10px;
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
    }
  }
</style>
