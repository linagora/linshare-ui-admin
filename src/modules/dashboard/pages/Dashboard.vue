<template>
  <div class="dashboard">
    <h1 class="title">{{ $t('DASHBOARD.TITLE')}}</h1>
    <h3 class="subtitle">{{ $t('DASHBOARD.SUBTITLE') }}</h3>
    <a-row type='flex' :gutter="60" class="dashboard-item-container">
      <a-col class="dashboard-item-container__column" :xs="24" :lg="12" :xl="8">
        <DashboardItem
          :cardTitle="$t('DASHBOARD.DOMAINS')"
          :subTitle="$t('DASHBOARD.MANAGE_DOMAINS')"
          img="domain"
        />
      </a-col>
      <a-col class="dashboard-item-container__column" :xs="24" :lg="12" :xl="8">
        <DashboardItem
          :cardTitle="$t('DASHBOARD.USERS')"
          :subTitle="$t('DASHBOARD.MANAGE_USERS')"
          img="user"
        />
      </a-col>
      <a-col class="dashboard-item-container__column" :xs="24" :lg="12" :xl="8">
        <DashboardItem
          :cardTitle="$t('DASHBOARD.HISTORY')"
          :subTitle="$t('DASHBOARD.AUDIT_THE_APPLICATION')"
          img="history"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DashboardItem from '../components/DashboardItem.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    DashboardItem
  }
});
</script>

<style lang='less'>
  @import '@/core/styles/variables';

  .dashboard {
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

    .dashboard-item-container {
      margin-top: 50px;
      flex-wrap: wrap;

      &__column {
        min-width: 400px;
        margin: 20px 0px;
      }
    }
  }
</style>
