<template>
  <div class="page-title">
    <a-breadcrumb :routes="breadcrumbs">
      <template #itemRender="{ route, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ $t(route.label) }}
        </span>

        <router-link v-else :to="route.path">
          {{ $t(route.label) }}
        </router-link>
      </template>
    </a-breadcrumb>

    <div class="title">
      <h1>{{ title }}</h1>
      <info-circle-filled
        v-if="containHelper"
        v-show="!showHelper"
        @click.prevent="toggleHelper"
      />
      <slot name="titlePostfix"/>
    </div>
    <h3 class="subtitle">{{ subtitle }}</h3>
    <slot name="subTitlePostfix"/>
    <a-alert
      v-if="containHelper && showHelper"
      type="info"
      closable
      :after-close="handleClosingHelper"
    >
      <template #description>
        <slot name="helperContent"/>
      </template>
    </a-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from 'vue';
import { InfoCircleFilled } from '@ant-design/icons-vue';

export interface PageTitleProps {
  title: string;
  subtitle: string;
  breadcrumbs?: object;
}

export default defineComponent({
  components: {
    InfoCircleFilled
  },
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  setup (props: PageTitleProps, { slots }: SetupContext) {
    const showHelper = ref(true);
    const containHelper = slots.helperContent && !!slots.helperContent();

    function toggleHelper () {
      showHelper.value = !showHelper.value;
    }

    function handleClosingHelper () {
      showHelper.value = false;
    }

    return {
      containHelper,
      handleClosingHelper,
      showHelper,
      toggleHelper
    };
  }
});
</script>

<style lang="less" scoped>
  .page-title {
    margin-bottom: 10px;

    .breadcrumb {
      margin-bottom: 20px;
    }

    .title {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      h1 {
        margin-bottom: 0;
        margin-right: 5px;
        font-weight: 600;
        font-size: 24px;
        color: @text-color-primary-heavy;
      }

      .anticon {
        color: @text-color-secondary;
      }
    }

    .subtitle {
      display: inline-block;
      margin-right: 15px;
      font-weight: 400;
      color: @text-color-secondary;
    }
  }
</style>
