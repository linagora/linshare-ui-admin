<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeleteIcon',
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
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="68" height="68" rx="16" fill="#E8F4FF" />

    <path
      xmlns="http://www.w3.org/2000/svg"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M34 49.75C42.6985 49.75 49.75 42.6985 49.75 34C49.75 25.3015 42.6985 18.25 34 18.25C25.3015 18.25 18.25 25.3015 18.25 34C18.25 42.6985 25.3015 49.75 34 49.75ZM32.2001 26.8C32.2001 25.8059 33.0059 25 34.0001 25C34.9942 25 35.8001 25.8059 35.8001 26.8V32.2H41.2C42.1941 32.2 43 33.0059 43 34C43 34.9941 42.1941 35.8 41.2 35.8H35.8001V41.2C35.8001 42.1941 34.9942 43 34.0001 43C33.0059 43 32.2001 42.1941 32.2001 41.2V35.8H26.8C25.8059 35.8 25 34.9941 25 34C25 33.0059 25.8059 32.2 26.8 32.2H32.2001V26.8Z"
      fill="#007AFF"
    />
  </svg>
</template>
