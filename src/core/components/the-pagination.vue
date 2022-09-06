<template>
  <div class="pagination-ctn">
    <div class="pagination-selector-ctn">
      <a-pagination
        v-show="visible"
        :total="pagination.total"
        :current="pagination.current"
        :page-size="pagination.pageSize"
        @change="handleChange"
      />
      <span class="total-number">{{ $t('GENERAL.TOTAL') }} : {{ pagination.total }}</span>
    </div>

    <div class="page-size-selector-ctn">
      <a-button
        v-for="(option, index) in pageSizeOptions"
        :key="index"
        :class="'square-button' + (option === pagination.pageSize ? ' square-button--active' : '')"
        @click="onSelectPageSize(option)"
      >
        {{ option }}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';

export default defineComponent({
  name: 'ThePagination',
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const pageSizeOptions = ref([10, 25, 50, 100]);
    const visible = computed(() => props.isVisible);
    const pagination = reactive(props.modelValue);

    function handleChange(page?: number) {
      pagination.current = page || pagination.current;
      emit('update:modelValue', pagination);
      emit('change', pagination);
    }

    function onSelectPageSize(newValue: number) {
      pagination.pageSize = newValue;

      if (pagination.total <= pagination.pageSize * (pagination.current - 1)) {
        pagination.current = 1;
      }

      handleChange();
    }

    return {
      pageSizeOptions,
      pagination,
      visible,
      onSelectPageSize,
      handleChange,
    };
  },
});
</script>

<style lang="less" scoped>
.pagination-ctn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .page-size-selector-ctn {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    @media (max-width: 500px) {
      display: none;
    }

    .square-button {
      min-width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px;
      margin: 4px;
      font-weight: 400;
      background-color: @component-background;
      color: @text-color-primary-heavy;
      border: 0px;

      &--active {
        background-color: @item-active-bg;
      }

      &:hover,
      &:focus {
        background-color: @item-active-bg;
        border: 0px;
        outline: none;
      }
    }
  }

  .pagination-selector-ctn {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .total-number {
    margin-left: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
