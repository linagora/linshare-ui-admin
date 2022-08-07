<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.7878 12L8.82249 16.9653C8.48776 17.3001 8.48776 17.8428 8.82249 18.1775C9.15723 18.5123 9.69994 18.5123 10.0347 18.1775L15.6061 12.6061C15.9408 12.2714 15.9408 11.7287 15.6061 11.3939L10.0347 5.82249C9.69994 5.48776 9.15723 5.48776 8.82249 5.82249C8.48776 6.15723 8.48776 6.69994 8.82249 7.03468L13.7878 12Z"
      fill="currentColor"
    />
  </svg>
</template>
<script lang="ts" setup>
interface Props {
  width?: string;
  height?: string;
}
withDefaults(defineProps<Props>(), { width: '24', height: '24' });
</script>
