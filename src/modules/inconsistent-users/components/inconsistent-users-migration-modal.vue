<template>
  <a-modal
    class="filter-modal"
    :destroy-on-close="true"
    :visible="visible"
    :title="$t('GENERAL.MIGRATE')"
    @cancel="
      reset();
      $emit('close');
    "
  >
    <a-form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="$t('GENERAL.DOMAIN')">
        <a-select
          v-model:value="filterForm.domain"
          :options="domainOptions"
          :placeholder="$t('REPORTING.FILTERS_MODAL.DOMAIN_SELECT_PLACEHOLDER')"
        ></a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="footer">
        <a-button class="ls-button ls-reset" type="primary" @click="reset">
          {{ $t('GENERAL.RESET') }}
        </a-button>
        <a-button :disabled="!filterForm.domain" class="ls-button ls-ok" type="primary" @click="apply">
          <a-spin v-if="loading" />
          <span v-else>{{ $t('GENERAL.APPLY') }}</span>
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import useInconsistentUsers from '@/modules/inconsistent-users/hooks/useInconsistentUsers';
import Domain from '@/modules/domain/types/Domain';
import { useReportingStore } from '../store';
import { InconsistentUsers } from '../types/InconsistentUsers';

interface Props {
  visible: boolean;
  selectedUsers: InconsistentUsers[];
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

// composable
const { loading, handleMigrateInconsistentUsers } = useInconsistentUsers();

const emits = defineEmits(['close']);
const { domains } = storeToRefs(useReportingStore());
const { getDomainsList: domainsList } = storeToRefs(useDomainStore());
const domainOptions = computed(() =>
  domainsList.value.map((domain) => ({
    label: domain.name,
    value: domain.uuid,
  }))
);
const filterForm = reactive<{
  domain: string;
}>({
  domain: '',
});

async function apply() {
  const result = await handleMigrateInconsistentUsers(props.selectedUsers, filterForm.domain);
  if (result) {
    // emits('refresh');
    onCloseModal();
  }
}

async function onCloseModal() {
  emits('close');
  reset();
}

function reset() {
  filterForm.domain = '';
}
</script>

<style lang="less">
.filter-modal {
  .ant-modal-header {
    border-radius: 16px;
    border-bottom: none;

    .ant-modal-title {
      text-align: center;
    }
  }

  .ant-modal-content {
    border-radius: 16px;
  }

  .ant-modal-footer {
    border-top: none;
    padding: 10px 24px 20px;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 28px;

    .ls-button {
      flex-grow: 1;
    }

    .ls-reset,
    .ls-reset:hover {
      background-color: #f3f3f7;
      color: #007aff;
      border-color: #f3f3f7;
    }
  }
}
</style>