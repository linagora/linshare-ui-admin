<script lang="ts" setup>
import SortIcon from '@/core/components/icons/sort-icon.vue';
import { SORT_ORDER } from '@/core/types/Sort';
import type { TextAlignProperty } from 'csstype';
import { computed, ref } from 'vue';

export interface LsTableColumn {
  title: string;
  width?: string;
  key: string;
  sorter?: (a: any, b: any) => number;
  align?: TextAlignProperty;
}

const props = defineProps<{
  columns: LsTableColumn[];
  dataSource: any[];
  loading: boolean;
}>();

const sortField = ref('');
const sortFunction = ref<(a: any, b: any) => number>(() => 0);
const sortOrder = ref<SORT_ORDER>(SORT_ORDER.ASC);
const data = computed(() =>
  props.dataSource.slice().sort((a: any, b: any) => {
    const compareResult = sortFunction.value(a, b);

    return sortOrder.value === SORT_ORDER.ASC ? compareResult : -compareResult;
  })
);

function toggleSort(column: LsTableColumn) {
  if (!column.sorter) return;

  if (sortField.value === column.key) {
    sortOrder.value = sortOrder.value === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
  }

  sortField.value = column.key;
  sortFunction.value = column.sorter;
}
</script>

<template>
  <div class="table-wrapper">
    <table class="table-element">
      <thead class="table-element__header">
        <th
          v-for="column in columns"
          :key="column.key"
          :class="{ active: sortField === column.key }"
          :style="{ 'text-align': (column.align as TextAlignProperty | undefined) || 'left', width: column.width }"
        >
          <template v-if="column.sorter">
            <div class="with-sorter">
              <span>{{ column.title }}</span>
              <span>
                <sort-icon class="sorter" width="20" height="20" @click="toggleSort(column)"></sort-icon>
              </span>
            </div>
          </template>

          <template v-else>
            {{ column.title }}
          </template>
        </th>
      </thead>
      <tbody class="table-element__body">
        <tr v-if="loading">
          <td :colspan="columns.length || 1">
            <div class="info-ctn">
              <a-spin size="small"></a-spin>
            </div>
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length || 1">
            <div class="info-ctn">
              <span>{{ $t('GENERAL.EMPTY_MESSAGE') }}</span>
            </div>
          </td>
        </tr>
        <tr v-for="(row, index) in data" v-else :key="index">
          <td
            v-for="column in columns"
            :key="column.key"
            :class="{ active: sortField === column.key }"
            :style="{ 'text-align': (column.align as TextAlignProperty | undefined) || 'left' }"
          >
            <slot name="bodyCell" :column="column" :row="row" :index="index"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="less" scoped>
.table-wrapper {
  max-width: 100%;
  box-shadow: 0px 1px 0px #d3d9de;
  border: 1px solid #dce1e6;
  border-radius: 16px;
  overflow-x: auto;
  overflow-y: hidden;
}

.table-element {
  width: 100%;
  table-layout: fixed;
  border-radius: 5px;

  &__header {
    background-color: #f7f7fa;
    border-bottom: 1px solid @border-color-base;

    th {
      position: relative;
      text-transform: uppercase;
      font-weight: normal;
      text-align: left;
      padding: 16px;
    }

    th:not(:last-of-type):before {
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 1.6em;
      background-color: @border-color-base;
      transform: translateY(-50%);
      transition: background-color 0.3s;
      content: '';
    }

    th.active {
      background-color: #e4e5f0;
      .sorter {
        color: @primary-color;
      }
    }

    .with-sorter {
      display: flex;
      justify-content: space-between;

      .sorter {
        cursor: pointer;
        color: #a7abc3;
      }
    }
  }

  &__body {
    .info-ctn {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @text-color-secondary;
    }

    tr:not(:last-of-type) {
      border-bottom: 1px solid @border-color-base;
    }

    td {
      text-align: left;
      padding: 16px;

      &.active {
        background-color: #f7f7fa;
      }
    }
  }
}
</style>
