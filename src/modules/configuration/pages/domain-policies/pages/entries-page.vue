<template>
  <div class="domain-policies-page">
    <div class="domain-policies-page__content">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="less">
.domain-policies-page {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  &__content {
    width: 100%;
  }
}
</style>
