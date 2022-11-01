<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DotIcon',
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
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
</template>
