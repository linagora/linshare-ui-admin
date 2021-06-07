<template>
  <div class="manage-users">
    <PageTitle
      :title="$t('USERS.MANAGE_USERS.TITLE')"
      :subtitle="$t('USERS.MANAGE_USERS.SUBTITLE')"
      :breadcrumbs="breadcrumbs"
    >
      <template #helperContent>
        <div class='alert-message-in-description'>{{ $t('NAVIGATOR.USERS') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.DESCRIPTION') }}</div>
        <div class='alert-message-in-description'>{{ $t('USERS.MANAGE_USERS.OPERATION') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.SEARCH_GUIDE') }}</div>
        <div>{{ $t('USERS.MANAGE_USERS.NAVIGATE_GUIDE') }}</div>
      </template>
    </PageTitle>

    <div class="users-list">
      <LargeTable />
      <SmallTable />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageTitle from '@/core/components/PageTitle.vue';
import LargeTable from '@/modules/user/components/LargeTable.vue';
import SmallTable from '@/modules/user/components/SmallTable.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ManageUsers',
  components: {
    LargeTable,
    SmallTable,
    PageTitle
  },
  setup () {
    const { meta } = useRoute();

    const breadcrumbs = meta && meta.parent && meta.parentName
      ? [{
        key: meta.parent,
        label: meta.parentName
      }] : [];

    return {
      breadcrumbs
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
