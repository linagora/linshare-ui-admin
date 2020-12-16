<template>
  <div class="small-table">
    <ListItem v-for="item in items" :data="item" :key="item.uuid"/>
    <a-pagination v-show="data.length" v-model:current="page" :pageSize="pageSize" :total="data.length" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import ListItem from './ListItem.vue';

export default defineComponent({
  name: 'SmallTable',
  components: {
    ListItem
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  setup (props) {
    const page = ref(1);
    const items = computed(() => props.data.slice((page.value - 1) * props.pageSize, page.value * props.pageSize));

    return {
      page,
      items
    };
  }
});
</script>

<style lang='less' scoped>
  .small-table {
    display: none;
    @media (max-width: 1067px) {
      display: block;
    }
  }
</style>
