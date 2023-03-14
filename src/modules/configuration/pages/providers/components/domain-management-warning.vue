<template>
  <a-result status="warning" :title="$t('DOMAIN.WARNING.PAGE_NOT_ACCESSIBLE')">
    <template #extra>
      <router-link :to="{ name: 'ConfigurationEntries' }">
        <a-button key="console" type="primary">
          {{ $t('DOMAIN.WARNING.BACK_TO_CONFIGURATION') }}
        </a-button>
      </router-link>
    </template>
  </a-result>
</template>
