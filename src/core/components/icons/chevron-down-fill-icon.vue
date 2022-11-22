<script lang="ts" setup>
interface Props {
  width?: string;
  height?: string;
}
withDefaults(defineProps<Props>(), { width: '24', height: '24' });
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5206 9.20801H7.47951C6.37147 9.20801 5.85542 10.5815 6.6893 11.3111L11.2098 15.2666C11.6623 15.6625 12.3378 15.6625 12.7903 15.2666L17.3108 11.3111C18.1447 10.5815 17.6286 9.20801 16.5206 9.20801Z"
      fill="currentColor"
    />
  </svg>
</template>
