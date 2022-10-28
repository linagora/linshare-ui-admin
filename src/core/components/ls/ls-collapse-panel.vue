<template>
  <a-collapse-panel class="ls-collapse-panel" v-bind="$attrs">
    <slot v-for="slot in Object.keys($slots)" :name="slot" />
  </a-collapse-panel>
</template>
<style lang="less">
.ls-collapse-panel.ant-collapse-item {
  border: 1px solid #e4e5f0 !important;
  border-radius: 16px !important;
  overflow: hidden;

  .ant-collapse-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 28px !important;
    background: #ffffff;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px !important;
    color: #434657;
    border: none !important;
    overflow: hidden;
  }

  .ant-collapse-content {
    border-top: none;
    padding: 0 28px 28px !important;
  }
  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-collapse-arrow {
    width: 44px;
    height: 44px;
    background: #ffffff;
    border: 1px solid #e4e5f0;
    border-radius: 10px;
    display: flex !important;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #007aff !important;
    font-weight: bold;
  }
}
</style>
