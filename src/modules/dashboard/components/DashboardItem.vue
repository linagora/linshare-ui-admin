<template>
  <a-card class="dashboard-item" @click="goToRoute">
    <div class="dashboard-item__title-container">
      <h1 class="dashboard-item__title">{{ cardTitle }}</h1>
      <h3 class="dashboard-item__subtitle">{{ subTitle }}</h3>
    </div>
    <div class="dashboard-item__image-container">
      <slot name="image"/>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/core/router';

export default defineComponent({
  name: 'DashboardItem',
  props: {
    cardTitle: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    routeName: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    function goToRoute () {
      if (props.routeName) {
        router.push({ name: props.routeName });
      }
    }

    return {
      goToRoute
    };
  }
});
</script>

<style lang='less'>
  @import '@/assets/styles/variables';

  .dashboard-item {
    cursor: pointer;
    height:100%;
    box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    &:hover {
      box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.2);
    }

    &__title-container {

      .dashboard-item__title {
        font-weight: 600;
        font-size: 24px;
        color: @dark-blue;
      }

      .dashboard-item__subtitle {
        font-weight: 400;
        color: #1B4157;
      }
    }

    &__image-container {
      flex: 1;
      text-align: right;

      img {
        width: 50%;
        min-width: 150px;
        max-width: 200px;
      }
    }

    .ant-card-body {
      display: flex;
      align-items: center;
      padding-right: 0;
      height: 100%;
    }
  }
</style>
