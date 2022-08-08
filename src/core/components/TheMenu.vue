<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="navigation-menu">
    <a-menu-item key="configuration">
      <router-link :to="{ name: 'Configuration' }">
        {{ $t('NAVIGATOR.CONFIGURATION') }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="administration">
      <router-link :to="{ name: 'Administration' }">
        {{ $t('NAVIGATOR.ADMINISTRATION') }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="reporting">
      <router-link :to="{ name: 'Reporting' }">
        {{ $t('NAVIGATOR.REPORTING') }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="activities" @click="redirect('NAVIGATOR.ACTIVITIES')">
      {{ $t('NAVIGATOR.ACTIVITIES') }}
    </a-menu-item>
    <a-menu-item key="upgrades" @click="redirect('NAVIGATOR.UPGRADES')">
      {{ $t('NAVIGATOR.UPGRADES') }}
    </a-menu-item>
    <a-menu-item v-if="isBeta" :title="$t('BETA.MENU_TITLE')">
      <a :href="legacyAppUrl">{{ $t('BETA.MENU') }}</a>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useLegacyFeatures from '../hooks/useLegacyFeatures';
import config from '@/config';

const { currentRoute } = useRouter();

const { redirect } = useLegacyFeatures();
const current = ref([currentRoute.value.path.split('/')[1]]);
const isBeta = config.beta;
const legacyAppUrl = config.legacyAppUrl;

watch(currentRoute, (newRoute) => {
  current.value = [newRoute.path.split('/')[1]];
});
</script>

<style lang="less">
.ant-menu.ant-menu-horizontal.navigation-menu {
  border-bottom: 2px solid @primary-color;
  background: @primary-color;
  color: @text-color-inverse;

  .ant-menu-item-disabled {
    color: fade(@text-color-inverse, 25%) !important;
  }

  .ant-menu-item-selected {
    color: @text-color-inverse;

    &::after {
      border-bottom: 2px solid @text-color-inverse;
    }
  }

  .ant-menu-item {
    &:hover {
      color: @text-color-inverse;
    }

    &:hover::after {
      border-bottom: 2px solid @text-color-inverse;
    }

    a {
      color: @text-color-inverse;
    }
  }
}
</style>
