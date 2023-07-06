<template>
  <a-tabs
    v-model:activeKey="activeKey"
    class="email-templates-vertical-tabs"
    tab-position="left"
    @change="onSelectTemplateTab"
  >
    <a-tab-pane v-for="tab in Object.values(tabs)" :key="tab.key" :tab="tab.name"></a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES } from '../router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
//data
const activeKey = ref<'configuration' | 'layout' | 'footer' | 'content' | 'activation'>('configuration');
const tabs = computed(() => ({
  configuration: {
    name: t('EMAIL_TEMPLATES.VERTICAL_TABS.CONFIGURATION'),
    key: 'configuration',
    to: { name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION },
  },
  layout: {
    name: t('EMAIL_TEMPLATES.VERTICAL_TABS.LAYOUT'),
    key: 'layout',
    to: { name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT },
  },
  footer: {
    name: t('EMAIL_TEMPLATES.VERTICAL_TABS.FOOTER'),
    key: 'footer',
    to: { name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.FOOTER },
  },
  content: {
    name: t('EMAIL_TEMPLATES.VERTICAL_TABS.CONTENT'),
    key: 'content',
    to: { name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONTENT },
  },
  activation: {
    name: t('EMAIL_TEMPLATES.VERTICAL_TABS.ACTIVATION'),
    key: 'activation',
    to: { name: CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ACTIVATION },
  },
}));

//methods
function onSelectTemplateTab() {
  router.push(tabs.value[activeKey.value].to);
}

watch(
  () => route.fullPath,
  (newVal) => {
    switch (route.name) {
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION:
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONFIGURATION_DETAIL:
        activeKey.value = 'configuration';
        break;
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT:
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.LAYOUT_DETAIL:
        activeKey.value = 'layout';
        break;
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.ACTIVATION:
        activeKey.value = 'activation';
        break;
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.CONTENT:
        activeKey.value = 'content';
        break;
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.FOOTER:
      case CONFIGURATION_EMAIL_TEMPLATES_ROUTE_NAMES.FOOTER_DETAIL:
        activeKey.value = 'footer';
        break;
      default:
        activeKey.value = 'configuration';
        break;
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less">
.email-templates-vertical-tabs {
  text-transform: capitalize;

  .ant-tabs-tab {
    padding: 12px 16px;
    height: 44px;
    border-radius: 8px;
    text-align: left;
    width: 280px;
    color: #6d7885;
  }

  .ant-tabs-tab-active {
    background-color: @primary-color;
    color: #fff;
    padding: 12px 16px;
    height: 44px;
    border-radius: 8px;
    text-align: left;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fff !important;
  }

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-nav-list {
    border-right: none;
  }

  .ant-tabs-content-holder {
    display: none;
  }
}
</style>
