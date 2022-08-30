<script lang="ts" setup>
interface Props {
  width?: string;
  height?: string;
}
withDefaults(defineProps<Props>(), { width: '24', height: '24' });
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.55805 9.63508C6.19862 9.327 5.65751 9.36863 5.34943 9.72805C5.04136 10.0875 5.08298 10.6286 5.4424 10.9367L11.4424 16.0795C11.7634 16.3547 12.2371 16.3547 12.558 16.0795L18.558 10.9367C18.9175 10.6286 18.9591 10.0875 18.651 9.72805C18.3429 9.36863 17.8018 9.327 17.4424 9.63508L12.0002 14.2998L6.55805 9.63508Z"
      fill="currentColor"
    />
  </svg>
</template>
