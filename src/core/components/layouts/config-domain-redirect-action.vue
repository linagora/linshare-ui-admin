<script lang="ts" setup>
import ArrowRightIcon from '@/core/components/icons/arrow-right-icon.vue';
import ArrowLeftIcon from '@/core/components/icons/arrow-left-icon.vue';
</script>
<template>
  <div class="config-domain-redirect-action">
    <div class="preview-action">
      <span class="label">Previous domain</span>
      <button class="action">
        <arrow-left-icon></arrow-left-icon>
      </button>
    </div>
    <div class="next-action">
      <button class="action">
        <arrow-right-icon></arrow-right-icon>
      </button>
      <span class="label">Next domain</span>
    </div>
  </div>
</template>
<style lang="less">
.config-domain-redirect-action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .preview-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  .next-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  .action {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
    width: 44px;
    height: 44px;
    background: #ffffff;
    border: 1px solid #e4e5f0;
    border-radius: 100px;
  }

  .icon {
    margin-right: 12px;
  }
}

@media (min-width: 992px) {
  .config-domain-redirect-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
  }
}
</style>
