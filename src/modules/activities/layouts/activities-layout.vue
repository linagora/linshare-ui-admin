<script lang="ts" setup>
import TheSubheader from '@/core/components/the-subheader.vue';
</script>
<template>
  <the-subheader :title="$t('NAVIGATOR.ACTIVITIES')" :detail="$t('ACTIVITIES.INTRODUCTION')">
    <template #action> </template>
  </the-subheader>
  <div class="activities-page">
    <div class="activities-page__wrapper">
      <div class="activities-page__header">
        <div class="activities-page__header-title">
          <div class="activities-page__header-title-content">
            <strong class="title">{{ $t('ACTIVITIES.ACTIVITY_LOG') }}</strong>
          </div>
        </div>
      </div>
      <div class="activities-page__body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.activities-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  background-color: #f6f6f6;
  padding: 0;

  &__back {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 4px;
    padding-right: 17px;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 16px;
    background: #ffffff;
    border-radius: 10px;
    min-height: 68vh;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e5f0;
    gap: 12px;
  }

  &__header-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;

    .title {
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      color: #434657;
    }

    .breakcrumb {
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 20px;
      color: #989cb1;
    }

    .current {
      color: #434657;
    }
  }

  .action {
    padding-left: 12px;
    padding-right: 12px;
    margin-right: 4px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  &__header-title-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }

  .desktop {
    display: none;
  }
}

@media (min-width: 992px) {
  .activities-page {
    padding: 20px;

    &__wrapper {
      padding: 32px;
    }

    .action {
      .icon {
        margin-right: 8px;
      }

      .desktop {
        display: block;
      }
    }
  }
}
</style>
