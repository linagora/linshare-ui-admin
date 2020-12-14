<template>
  <div class="footer">
    <Copyright/>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Copyright from './Copyright.vue';

export default defineComponent({
  name: 'Footer',
  components: {
    Copyright
  }
});
</script>

<style lang="less" scoped>
  .footer {
    background-color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    font-size: 12px;
    line-height: 15px;
    color: #A9A9A9;

    a {
      margin-left: 4px;
    }
  }
</style>
