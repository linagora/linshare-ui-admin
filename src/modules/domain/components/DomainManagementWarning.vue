<template>
  <a-result status="warning" :title="$t('DOMAIN.WARNING.PAGE_NOT_AVAILABLE')">
    <template #extra>
      <router-link :to="{ name: 'Configuration'}">
        <a-button key="console" type="primary">{{ $t('DOMAIN.WARNING.BACK_TO_CONFIGURATION') }}</a-button>
      </router-link>
    </template>
  </a-result>
</template>
