<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlusIcon',
  props: {
    width: {
      type: String,
      default: '24',
    },
    height: {
      type: String,
      default: '24',
    },
  },
});
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.99979 3.49387C10.3943 3.49387 10.7141 3.81366 10.7141 4.20815V9.92244H16.4284C16.8229 9.92244 17.1426 10.2422 17.1426 10.6367C17.1426 11.0312 16.8229 11.351 16.4284 11.351H10.7141V17.0653C10.7141 17.4598 10.3943 17.7796 9.99979 17.7796C9.6053 17.7796 9.2855 17.4598 9.2855 17.0653V11.351H3.57122C3.17673 11.351 2.85693 11.0312 2.85693 10.6367C2.85693 10.2422 3.17673 9.92244 3.57122 9.92244H9.2855V4.20815C9.2855 3.81366 9.6053 3.49387 9.99979 3.49387Z"
      fill="currentColor"
    />
  </svg>
</template>
