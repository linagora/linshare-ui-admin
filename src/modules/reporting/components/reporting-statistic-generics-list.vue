<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import SortIcon from '@/core/components/icons/sort-icon.vue';
import ChevronDownIcon from '@/core/components/icons/chevron-down-icon.vue';
import { GenericActions, GenericResourceStatistic } from '../types/GenericStatistic';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  data: GenericResourceStatistic[];
  loading: boolean;
}>();

const { t } = useI18n();
const showStatistic = reactive<Record<string, boolean>>({});
const filterText = ref('');
const sortField = ref<GenericActions[]>([]);
const statistics = computed(() =>
  props.data
    .filter((stat) =>
      t(`REPORTING.GENERICS.RESOURCE.${stat.resource}`).toLowerCase().includes(filterText.value.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField.value.length) {
        return b[sortField.value[0]] - a[sortField.value[0]];
      }

      return 0;
    })
);
</script>

<template>
  <div class="action-bar">
    <a-input v-model:value="filterText" class="action-bar__filter" placeholder="Search" allow-clear>
      <template #prefix>
        <search-outlined></search-outlined>
      </template>
    </a-input>

    <a-dropdown class="action-bar__sort" :trigger="['click']">
      <a-button>
        <template #icon>
          <sort-icon class="anticon"></sort-icon>
        </template>
        Sort by
      </a-button>

      <template #overlay>
        <a-menu v-model:selectedKeys="sortField" selectable>
          <a-menu-item key="CREATE">{{ $t('REPORTING.GENERICS.ACTION.CREATE') }}</a-menu-item>
          <a-menu-item key="DELETE">{{ $t('REPORTING.GENERICS.ACTION.DELETE') }}</a-menu-item>
          <a-menu-item key="UPDATE">{{ $t('REPORTING.GENERICS.ACTION.UPDATE') }}</a-menu-item>
          <a-menu-item key="DOWNLOAD">{{ $t('REPORTING.GENERICS.ACTION.DOWNLOAD') }}</a-menu-item>
          <a-menu-item key="GET">{{ $t('REPORTING.GENERICS.ACTION.GET') }}</a-menu-item>
          <a-menu-item key="SUCCESS">{{ $t('REPORTING.GENERICS.ACTION.SUCCESS') }}</a-menu-item>
          <a-menu-item key="FAILURE">{{ $t('REPORTING.GENERICS.ACTION.FAILURE') }}</a-menu-item>
          <a-menu-item key="PURGE">{{ $t('REPORTING.GENERICS.ACTION.PURGE') }}</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>

  <div v-if="loading" class="info-ctn">
    <a-spin size="small"></a-spin>
  </div>

  <div v-else-if="statistics.length === 0" class="info-ctn">
    <span>{{ $t('GENERAL.EMPTY_MESSAGE') }}</span>
  </div>

  <div v-for="item in statistics" v-else :key="item.resource" class="statistic-resource">
    <div class="statistic-resource__header">
      <span class="title">{{ $t(`REPORTING.GENERICS.RESOURCE.${item.resource}`) }}</span>
      <div
        class="collapse"
        :class="{ expanded: showStatistic[item.resource] }"
        @click="showStatistic[item.resource] = !showStatistic[item.resource]"
      >
        <span class="text">{{ $t(`GENERAL.${showStatistic[item.resource] ? 'COLLAPSE' : 'EXPAND'}`) }}</span>
        <chevron-down-icon class="icon"></chevron-down-icon>
      </div>
    </div>

    <div v-show="showStatistic[item.resource]" class="statistic-resource__body">
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.CREATE') }}</span>
        <span class="value">{{ item.CREATE }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.DELETE') }}</span>
        <span class="value">{{ item.DELETE }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.UPDATE') }}</span>
        <span class="value">{{ item.UPDATE }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.DOWNLOAD') }}</span>
        <span class="value">{{ item.DOWNLOAD }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.GET') }}</span>
        <span class="value">{{ item.GET }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.SUCCESS') }}</span>
        <span class="value">{{ item.SUCCESS }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.FAILURE') }}</span>
        <span class="value">{{ item.FAILURE }}</span>
      </div>
      <div class="data">
        <span class="action">{{ $t('REPORTING.GENERICS.ACTION.PURGE') }}</span>
        <span class="value">{{ item.PURGE }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.info-ctn {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: @text-color-secondary;
}
.action-bar {
  display: none;
}

@media (min-width: @screen-sm-min) {
  .action-bar {
    display: flex;
    margin-bottom: 16px;
    &__filter {
      width: 375px;
    }

    &__sort {
      margin-left: 5px;
    }
  }
}
.statistic-resource {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid @border-color-base;
  border-radius: 10px;
  padding: 16px;
  margin-top: 10px;

  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;

    .title {
      font-weight: 600;
    }

    .collapse {
      cursor: pointer;
      color: @primary-color;
      display: flex;
      align-items: center;

      .text {
        display: none;
      }

      @media (min-width: @screen-sm-min) {
        .text {
          display: block;
          margin-right: 5px;
        }
      }

      &.expanded .icon {
        transform: rotate(180deg);
      }
    }
  }

  &__body {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;

    .data {
      width: 50%;
      padding: 5px 0;
      display: flex;
      justify-content: space-between;

      .action {
        color: @text-color-secondary;
      }

      .value {
        color: #434657;
      }
    }

    .data:nth-child(odd) {
      padding-right: 15px;
      border-right: 0.5px solid @border-color-base;
    }

    .data:nth-child(even) {
      padding-left: 15px;
    }
  }
}
</style>
