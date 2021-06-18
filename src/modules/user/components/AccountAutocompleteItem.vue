<template>
  <div class="autocomplete-item__user">
    <div class="user-avatar">{{ data.firstName[0] }}</div>
    <div class="user-info">
      <span class="user-name">{{ data.firstName }} {{ data.lastName }}</span>
      <span class="user-mail">{{ data.mail }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AccountAutocompleteItem',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
});
</script>

<style lang="less" scoped>
  .autocomplete-item__user {
    display: flex;
    align-items: center;

    .user-avatar {
      box-shadow: 0 1px 2px rgb(0 0 0 / 16%), 0 2px 1px rgb(0 0 0 / 12%);
      width: 26px;
      height: 26px;
      background-color: #05b1ff;
      color: #fff;
      border-radius: 50%;
      display: block;
      text-align: center;
      line-height: 27px;
      margin-right: 10px;
    }

    .user-info {
      margin-right: 10px;

      .user-name {
        display: block;
        font-size: 1.035em;
        font-weight: 600;
      }

      .user-mail {
        display: block;
        font-size: 0.85em;
        margin-top: -5px;
      }
    }
  }
</style>
