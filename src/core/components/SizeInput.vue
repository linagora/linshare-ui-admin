<template>
  <a-input
    v-model:value="value"
    type="number"
    @change="updateModelValue"
  >
    <template #addonAfter>
      <a-select
        v-model:value="base"
        @change="updateModelValue"
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

<script lang="ts">
import { defineComponent, onMounted, ref, watch, SetupContext } from 'vue';
import { getReadableSize, STORAGE_UNITS } from '@/core/utils/unitStorage';

export default defineComponent({
  name: 'SizeInput',
  props: {
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }: SetupContext) {
    const base = ref(1);
    const value = ref(0);

    function setBaseAndValue (bytesValue: number) {
      const readable = getReadableSize(bytesValue);

      value.value = readable.value;
      base.value = readable.unit.base;
    }

    watch(() => props.modelValue, newValue => {
      if (base.value * value.value !== newValue) {
        setBaseAndValue(newValue);
      }
    });

    onMounted(() => {
      setBaseAndValue(props.modelValue);
    });

    function updateModelValue () {
      emit('update:modelValue', value.value * base.value);
    }

    return {
      base,
      value,
      updateModelValue,
      STORAGE_UNITS
    };
  }
});
</script>
