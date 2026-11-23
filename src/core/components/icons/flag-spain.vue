<script lang="ts" setup>
interface Props {
  width?: string;
  height?: string;
}
withDefaults(defineProps<Props>(), { width: '24', height: '24' });
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24" fill="none">
    <path
      d="M0 12C0 13.4678 0.264047 14.8742 0.746391 16.1739L12 17.2174L23.2536 16.1739C23.736 14.8742 24 13.4678 24 12C24 10.5322 23.736 9.12581 23.2536 7.82611L12 6.78261L0.746391 7.82611C0.264047 9.12581 0 10.5322 0 12Z"
      fill="#FFDA44"
    />
    <path
      d="M23.2536 7.82611C21.5581 3.25655 17.1596 0 12 0C6.84043 0 2.44192 3.25655 0.746391 7.82611H23.2536Z"
      fill="#D80027"
    />
    <path
      d="M0.746391 16.1739C2.44192 20.7435 6.84043 24 12 24C17.1596 24 21.5581 20.7435 23.2536 16.1739H0.746391Z"
      fill="#D80027"
    />
  </svg>
</template>
