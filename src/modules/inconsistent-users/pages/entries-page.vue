<template>
  <div class="inconsistent-users-page">
    <div class="inconsistent-users-page__content">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="less">
.inconsistent-users-page {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  &__content {
    width: 100%;
  }
}
</style>
