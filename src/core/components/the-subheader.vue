<template>
  <div class="ls-app-subheader">
    <div class="ls-app-subheader__content">
      <div class="content">
        <span class="title">{{ title }}</span>
        <span class="details">{{ detail }}</span>
      </div>

      <div class="action">
        <slot name="action"></slot>
      </div>
    </div>

    <div class="ls-app-subheader__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  title: string;
  detail: string;
}>();
</script>

<style lang="less" scoped>
.ls-app-subheader {
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.08), 0px 0px 2px 0px rgba(0, 0, 0, 0.08);
  background-color: @white;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;

  &__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 48px;

    .content {
      display: flex;
      align-items: flex-start;
      flex-direction: column;

      .title {
        font-size: 28px;
        font-weight: 700;
      }

      .details {
        color: @text-color-secondary;
      }
    }

    .action {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

@media (min-width: 992px) {
  .ls-app-subheader {
    &__content {
      .content {
        display: flex;
        align-items: center;
        justify-content: baseline;
        flex-direction: row;
        gap: 16px;
      }
    }
  }
}
</style>
