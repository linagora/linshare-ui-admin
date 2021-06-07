<template>
  <div :class="['page-title', { 'no-subtitle': !subtitle }]">
    <a-breadcrumb v-if="breadcrumbs && breadcrumbs.length" class="breadcrumb">
      <a-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.key">
        <router-link :to="{name: breadcrumb.key}">{{$t(breadcrumb.label)}}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
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
      class="alert-message"
      @close="showHelper = false"
      closable
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

    return { containHelper, showHelper, toggleHelper };
  }
});
</script>

<style lang="less" scoped>
  .page-title {
    margin-bottom: 30px;

    .breadcrumb {
      margin-bottom: 20px;
    }

    &.no-subtitle {
      margin-bottom: 55px;
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
        color: #1B4157;
      }

      .anticon {
        color: #999;
      }
    }

    .subtitle {
      display: inline-block;
      margin-right: 15px;
      font-weight: 400;
      color: #999;
    }

    .alert-message {
      margin-top: 30px;
    }
  }
</style>
