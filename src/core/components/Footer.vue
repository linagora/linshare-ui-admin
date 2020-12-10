<template>
  <div class="footer">
    <div>
      You are using the Open Source and free version of LinShare™, powered by Linagora © 2009–2019. Contribute to LinShare R&D by subscribing to an Enterprise offer.
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer'
});
</script>

<style lang="less">
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
