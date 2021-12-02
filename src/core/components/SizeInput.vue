<template>
  <a-input
    v-model:value="equivalent"
    type="number"
    @change="updateValue"
  >
    <template #addonAfter>
      <a-select
        v-model:value="base"
        @change="updateValue"
      >
        <a-select-option
          v-for="unit in STORAGE_UNITS"
          :key="unit.base"
        >
          {{ unit.label }}
        </a-select-option>
      </a-select>
    </template>
  </a-input>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { getReadableSize, STORAGE_UNITS } from '@/core/utils/unitStorage';

interface Props {
  value: number;
}

const base = ref(1);
const equivalent = ref(0);
const props = defineProps<Props>();
const emit = defineEmits(['update:value']);

function setBaseAndValue (bytesValue: number) {
  const readable = getReadableSize(bytesValue);

  equivalent.value = readable.value;
  base.value = readable.unit.base;
}

watch(() => props.value, newValue => {
  if (base.value * equivalent.value !== newValue) {
    setBaseAndValue(newValue);
  }
});

onMounted(() => {
  setBaseAndValue(props.value);
});

function updateValue () {
  emit('update:value', equivalent.value * base.value);
}
</script>
