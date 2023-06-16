<template>
  <svg :width="width" :height="height" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.06808 0.5682C1.44465 0.191623 2.05521 0.191623 2.43178 0.5682L8.49993 6.63559L14.5681 0.5682C14.9157 0.22059 15.4627 0.19385 15.8409 0.487982L15.9318 0.5682C16.3084 0.944777 16.3084 1.55533 15.9318 1.93191L9.86439 8.00005L15.9318 14.0682C16.2794 14.4158 16.3061 14.9628 16.012 15.3411L15.9318 15.4319C15.5552 15.8085 14.9447 15.8085 14.5681 15.4319L8.49993 9.36452L2.43178 15.4319C2.08417 15.7795 1.5372 15.8063 1.15892 15.5121L1.06808 15.4319C0.6915 15.0553 0.6915 14.4448 1.06808 14.0682L7.13547 8.00005L1.06808 1.93191C0.720468 1.5843 0.693728 1.03732 0.98786 0.659042L1.06808 0.5682Z"
      fill="#EA3C3C"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'CancelCrossIcon',
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
