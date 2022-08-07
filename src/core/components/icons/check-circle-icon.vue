<script lang="ts" setup>
interface Props {
  width?: string;
  height?: string;
}
withDefaults(defineProps<Props>(), { width: '24', height: '24' });
</script>
<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-v-47c2142c=""
  >
    <circle cx="12" cy="12" r="12" fill="currentColor"></circle>
    <path
      d="M6.5 12.5L10 16L17.5 8.5"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
</template>
