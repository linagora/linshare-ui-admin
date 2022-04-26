<template>
  <div class="oidc-callback">
    <a-spin />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { signinCallback } from '@/modules/auth/services/oidc';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';

const router = useRouter();

onMounted(async () => {
  try {
    await signinCallback();
    router.replace('/');
  } catch (error) {
    console.error(error);
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
});
</script>

<style lang="less" scoped>
  .oidc-callback {
    position: fixed;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: @text-color-inverse;
    backdrop-filter: blur(10px);
  }
</style>
