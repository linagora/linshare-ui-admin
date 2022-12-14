<script lang="ts" setup>
import config from '@/config';
import useMenu from '@/core/hooks/useMenu';
import useLegacyFeatures from '@/core/hooks/useLegacyFeatures';

const { redirect } = useLegacyFeatures();
const { current } = useMenu();
</script>

<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="navigation-menu">
    <a-menu-item key="configuration">
      <router-link :to="{ name: 'ConfigurationEntries' }">
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
      <a name="activities">
        {{ $t('NAVIGATOR.ACTIVITIES') }}
      </a>
    </a-menu-item>
    <a-menu-item key="upgrades" @click="redirect('NAVIGATOR.UPGRADES')">
      <a name="upgrades">
        {{ $t('NAVIGATOR.UPGRADES') }}
      </a>
    </a-menu-item>
    <a-menu-item key="beta">
      <a name="beta" :href="config.legacyAppUrl">
        {{ $t('BETA.MENU') }}
      </a>
    </a-menu-item>
  </a-menu>
</template>

<style lang="less">
.ant-menu.ant-menu-horizontal.navigation-menu {
  border-bottom: 2px solid @primary-color;
  background: @primary-color;
  color: @text-color-inverse;
  font-style: normal;
  font-weight: 600;
  font-size: 17px;

  .ant-menu-item-disabled {
    color: fade(@text-color-inverse, 25%) !important;
  }

  .ant-menu-item-selected {
    color: @text-color-inverse;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%);

    &::after {
      border-bottom: 2px solid @text-color-inverse;
    }
  }

  .ant-menu-item {
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: @text-color-inverse;

    &:hover::after {
      border-bottom: 2px solid @text-color-inverse;
    }

    &::after {
      right: 0;
      left: 0;
    }
  }
  .ant-menu-overflow-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .ant-menu-title-content a {
    color: @text-color-inverse;
  }
}

.ant-menu-item.ant-menu-item-only-child {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
