<template>
  <a-layout>
    <a-layout-sider
      v-if="isLargeScreen"
      width="300"
      theme="light"
    >
      <DomainsTree />
    </a-layout-sider>
    <a-layout-content>
      <div
        v-if="!isLargeScreen"
        style="margin-bottom: 10px;"
      >
        <a-button
          @click="showSidebar = true"
        >
          <template #icon>
            <MenuUnfoldOutlined />
          </template>
        </a-button>
      </div>
      <router-view />
    </a-layout-content>
  </a-layout>

  <a-drawer
    placement="left"
    :closable="false"
    :visible="showSidebar"
    width="300"
    @close="showSidebar = false"
  >
    <DomainsTree />
  </a-drawer>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { MenuUnfoldOutlined } from '@ant-design/icons-vue';
import DomainsTree from '@/modules/domain/components/DomainsTree.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const showSidebar = ref(false);
const isLargeScreen = useMediaQuery('(min-width: 769px)');
const { currentRoute } = useRouter();
const store = useStore();

onMounted(async () => {
  if (currentRoute.value.params.domain) {
    await store.dispatch('Domain/fetchDomainById', currentRoute.value.params.domain);
  }
});
</script>
