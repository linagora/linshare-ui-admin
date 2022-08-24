<script lang="ts" setup>
import IconCloseCircle from '../icons/close-circle-icon.vue';
defineEmits(['close']);
withDefaults(defineProps<{ value: string; closable?: boolean }>(), {
  value: '',
  closable: false,
});
</script>

<template>
  <div class="ls-tag">
    <span>{{ value }}</span>
    <icon-close-circle v-if="closable" class="icon" width="20" height="20" @click="$emit('close')"></icon-close-circle>
  </div>
</template>

<style lang="less" scoped>
.ls-tag {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  padding: 8px;
  background-color: @primary-1;
  color: @primary-color;
  margin-right: 8px;

  .icon {
    margin-left: 8px;
    cursor: pointer;
    color: #989cb1;
  }
}
</style>
