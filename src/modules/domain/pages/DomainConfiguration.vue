<template>
  <a-layout>
    <a-layout-sider
      v-if="isLargeScreen"
      width="300"
      theme="light"
    >
      <DomainTrees />
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
    <DomainTrees />
  </a-drawer>
</template>

<script lang='ts' setup>
import { useStore } from 'vuex';
import { watchEffect, ref, computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { MenuUnfoldOutlined } from '@ant-design/icons-vue';
import DomainTrees from '@/modules/domain/components/DomainsTree.vue';

const store = useStore();
const showSidebar = ref(false);
const isLargeScreen = useMediaQuery('(min-width: 769px)');
const domainsTree = computed(() => store.getters['Domain/getDomainsTree']);
const loggedUser = computed(() => store.getters['Auth/getLoggedUser']);

function prepareCurrentDomain () {
  if (domainsTree.value.uuid) {
    store.dispatch('Domain/fetchDomainById', domainsTree.value.uuid);
  }
}

function prepareDomainsTree () {
  if (loggedUser.value.uuid) {
    store.dispatch('Domain/fetchDomainsTree');
  }
}

watchEffect(prepareCurrentDomain);
watchEffect(prepareDomainsTree);
</script>
