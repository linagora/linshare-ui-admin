<template>
  <div class="contact-list-page">
    <div class="contact-list-page__content">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="less">
.contact-list-page {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  &__content {
    width: 100%;
  }
}
</style>
