<template>
  <a-row>
    <a-col :span="24">
      <div class="page">
        <router-link
          v-if="isPageAccessible('DomainUserProviders')"
          :to="{ name: 'DomainUserProviders' }"
        >
          <div class="page__menu-item">
            <span>{{ $t("NAVIGATOR.USER_PROVIDERS") }}</span>
            <RightOutlined />
          </div>
        </router-link>

        <router-link
          v-if="isPageAccessible('DomainGroupProviders')"
          :to="{ name: 'DomainGroupProviders' }"
        >
          <div class="page__menu-item">
            <span>{{ $t("NAVIGATOR.GROUP_PROVIDERS") }}</span>
            <RightOutlined />
          </div>
        </router-link>

        <router-link
          v-if="isPageAccessible('DomainWorkspaceProviders')"
          :to="{ name: 'DomainWorkspaceProviders' }"
        >
          <div class="page__menu-item">
            <span>{{ $t("NAVIGATOR.WORKSPACE_PROVIDERS") }}</span>
            <RightOutlined />
          </div>
        </router-link>
      </div>
    </a-col>
  </a-row>
</template>

<script lang='ts' setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { RightOutlined } from '@ant-design/icons-vue';
import { findDomainPage, canAccessPage } from '@/core/services/configuration-pages';

const store = useStore();
const loggedUserRole = computed(() => store.getters['Auth/getLoggedUserRole']);
const currentDomainType = computed(() => store.getters['Domain/getCurrentDomainType']);

function isPageAccessible (name: string) {
  const page = findDomainPage(name);

  return page && canAccessPage(page, loggedUserRole.value, currentDomainType.value);
}
</script>
