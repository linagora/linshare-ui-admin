<template>
  <div class="upgrade-list-detail-page">
    <a-alert class="upgrade-list-detail-page__help-text">
      <template #description>
        {{ $t('CONTACT_LIST.NOTE') }}
      </template>
    </a-alert>
  </div>
</template>
<style lang="less">
.upgrade-list-detail-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;

  &__help-text {
    padding: 12px 24px 12px 16px;
    gap: 6px;
    width: 100%;
    background: #f2f8ff;
    border-radius: 8px;
    border: none;
    color: #007aff;
    display: inline-block;
  }
}
</style>
