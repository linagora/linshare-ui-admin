<template>
  <div class="error-page">
    <div>
      <h1 class="error-page__big-title">
        {{ statusCode }}
      </h1>
      <h3 class="error-page__sub-title">
        {{ message }}
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    statusCode: {
      type: Number,
      default: 500
    },
    message: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
  .error-page {
    background-color: @white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    width: 100%;
    height: 100%;
    &__big-title {
      text-align: center;
      font-size: 65px;
    }
    &__sub-title {
      text-align: center;
      font-size: 30px;
    }
  }
</style>
