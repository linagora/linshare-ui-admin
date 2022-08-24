<template>
  <div class="ls-app-subheader">
    <div class="ls-app-subheader__content">
      <div class="content">
        <span class="title">{{ $t('NAVIGATOR.REPORTING') }}</span>
        <span class="details">{{ $t('REPORTING.INTRODUCTION') }}</span>
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
    height: 72px;

    .content {
      display: flex;
      align-items: center;

      .title {
        font-size: 28px;
        font-weight: 700;
      }

      .details {
        margin-left: 16px;
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
</style>
