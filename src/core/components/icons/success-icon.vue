<template>
  <svg :width="width" :height="height" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.92847 9.93067L2.3917 5.39391C2.05697 5.05917 1.51425 5.05917 1.17952 5.39391C0.844783 5.72864 0.844783 6.27136 1.17952 6.60609L6.32238 11.7489C6.65711 12.0837 7.19982 12.0837 7.53456 11.7489L17.8203 1.46323C18.155 1.1285 18.155 0.585786 17.8203 0.251051C17.4855 -0.0836838 16.9428 -0.0836838 16.6081 0.251051L6.92847 9.93067Z"
      fill="#30CD60"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'SuccessIcon',
  props: {
    width: {
      type: String as PropType<string>,
      default: '24',
    },
    height: {
      type: String as PropType<string>,
      default: '24',
    },
  },
});
</script>
