<template>
  <a-tabs v-model:activeKey="activeKey" centered>
    <a-tab-pane v-for="configuration in configurationTabs" :key="configuration.key" :tab="configuration.name">
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const activeKey = ref('QUOTA');
const configurationTabs = [
  {
    key: 'DETAILS',
    name: 'Details',
  },
  {
    key: 'PARAMETERS',
    name: 'Parameters',
  },
  {
    key: 'TYPE_MIME_POLICIES',
    name: 'Type mime policies',
  },
  {
    key: 'WELCOME_MESSAGES',
    name: 'Welcome messages',
  },
  {
    key: 'QUOTA',
    name: 'Quota',
  },
  {
    key: 'PUBLIC_KEYS_JWT',
    name: 'Public keys (JWT)',
  },
];
</script>
