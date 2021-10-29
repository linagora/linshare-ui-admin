<template>
  <a-modal
    :visible="state.visible"
    :title="$t('GENERAL.ASSOCIATED_DOMAINS')"
    @cancel="$emit('ok')"
  >
    <template #footer>
      <a-button
        type="primary"
        @click="$emit('ok')"
      >
        {{ $t('GENERAL.OK') }}
      </a-button>
    </template>

    <a-list
      :data-source="state.list"
      :loading="state.loading"
      :locale="{ emptyText }"
    >
      <template #renderItem="{ item }">
        <a-list-item class="domain-list-item">
          {{ item.name }}

          <template #actions>
            <a-tag>{{ $t(`DOMAIN.TYPES.${item.type}`) }}</a-tag>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>

<script lang='ts' setup>
import { AssociatedDomainModalState } from '@/modules/domain/hooks/useAssociatedDomainsModal';

interface Props {
  emptyText: string;
  state: AssociatedDomainModalState
}

defineProps<Props>();
defineEmits(['ok']);
</script>

<style lang="less" scoped>
  .domain-list-item {
    border-bottom: 1px solid @border-color-base;

    .ant-tag {
      color: @primary-4
    }
  }
</style>
