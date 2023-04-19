<template>
  <div class="inconsistent-users-tabs">
    <a-tabs v-model:activeKey="activeKey" @tab-click="onSelectInconsistentUsersTab">
      <a-tab-pane v-for="tab in Object.values(tabs)" :key="tab.key" :tab="$t(tab.name)"></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { INCONSISTENT_USERS_ROUTE_NAMES } from '../router';
import useBreadcrumbs from '@/core/hooks/useBreadcrumbs';

const router = useRouter();
const route = useRoute();
const { breadcrumbs } = useBreadcrumbs();

//data
const activeKey = ref('inconsistent');
const tabs = reactive({
  diagnostic: {
    name: 'INCONSISTENT_USERS.SCRUTINY.TITLE',
    key: 'diagnostic',
    to: { name: INCONSISTENT_USERS_ROUTE_NAMES.DIAGNOSIC },
  },
  inconsistent: {
    name: 'INCONSISTENT_USERS.TITLE',
    key: 'inconsistent',
    to: { name: INCONSISTENT_USERS_ROUTE_NAMES.INCONSISTENT },
  },
});

interface ConfigurationPage {
  key: string;
  name: string;
  to?: {
    name: string;
  };
}

//methods
function onSelectInconsistentUsersTab(tab: string) {
  const activeTab = tabs[tab as keyof typeof tabs] as ConfigurationPage;
  if (activeTab?.to) {
    router.push(activeTab?.to);
  }
}

// hooks
watch(
  () => route.name,
  (name) => {
    if (name) {
      tabs.value?.forEach((element) => {
        const matchingRouter = breadcrumbs.value.find((item) => {
          return item.path === element?.name;
        });
        if (matchingRouter) {
          activeKey.value = matchingRouter.path;
          return;
        }
      });
    }
  },
  { immediate: true }
);
</script>
<style lang="less"></style>
