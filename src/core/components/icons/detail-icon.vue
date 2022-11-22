<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ArchiveIcon',
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
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.6787 6.75C12.9162 6.75 13.9287 5.7375 13.9287 4.5C13.9287 3.2625 12.9162 2.25 11.6787 2.25C10.4412 2.25 9.42871 3.2625 9.42871 4.5C9.42871 5.7375 10.4412 6.75 11.6787 6.75ZM11.6787 9.75C10.4412 9.75 9.42871 10.7625 9.42871 12C9.42871 13.2375 10.4412 14.25 11.6787 14.25C12.9162 14.25 13.9287 13.2375 13.9287 12C13.9287 10.7625 12.9162 9.75 11.6787 9.75ZM11.6787 17.25C10.4412 17.25 9.42871 18.2625 9.42871 19.5C9.42871 20.7375 10.4412 21.75 11.6787 21.75C12.9162 21.75 13.9287 20.7375 13.9287 19.5C13.9287 18.2625 12.9162 17.25 11.6787 17.25Z"
      fill="currentColor"
    />
  </svg>
</template>
