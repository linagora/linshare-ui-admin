<template>
  <div class="pagination-ctn">
    <div class="pagination-selector-ctn">
      <a-pagination
        v-show="visible"
        :total="pagination.total"
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        @change="handleChange"
      />
    </div>
    <div class="page-size-selector-ctn">
      <a-button
        v-for="(option, index) in pageSizeOptions"
        :key="index"
        :class="'square-button' + (option === pagination.pageSize ? ' square-button--active' : '')"
        @click="onSelectPageSize(option)"
      >
        {{option}}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';

export default defineComponent({
  name: 'Pagination',
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    const pageSizeOptions = ref([10, 25, 50, 100]);
    const visible = computed(() => props.isVisible);
    const pagination = reactive(props.modelValue);

    function handleChange (page?: number) {
      pagination.current = page || pagination.current;
      emit('update:modelValue', pagination);
      emit('change', pagination);
    }

    function onSelectPageSize (newValue: number) {
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
      handleChange
    };
  }
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
        background-color: #F2F5F7;
        color: #1B4157;
        border: 0px;

        &--active {
          background-color: #CDEFFF;
        }

        &:hover, &:focus {
          background-color: #CDEFFF;
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
  }
</style>
