<template>
  <div v-if="loading === false" class="list-page">
    <a-transfer
      :data-source="combinedList"
      :target-keys="targetKeys"
      :operations="[customOperations.right, customOperations.left]"
      :disabled="!editable || !editing"
      :show-search="true"
      :show-select-all="true"
      :row-key="(item: any) => item.uuid"
      :titles="[customTitle.source, customTitle.list]"
      :filter-option="filterOption"
      @change="onChange"
    >
      <template
        #children="{ direction, filteredItems, selectedKeys, disabled: listDisabled, onItemSelectAll, onItemSelect }"
      >
        <a-table
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
              selectedKeys,
              onItemSelectAll,
              onItemSelect,
            })
          "
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :data-source="filteredItems"
          size="small"
        />
      </template>
    </a-transfer>
  </div>
  <div v-else class="spin">
    <a-spin></a-spin>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect, Ref, computed } from 'vue';
import { MimeType } from '@/modules/configuration/pages/type-mime-policies/types/MimeType';
import useMimesPolicies from '@/modules/configuration/pages/type-mime-policies/hooks/useMimePolicies';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  items: MimeType[];
  editable?: boolean;
  editing?: boolean;
}>();

const { t } = useI18n();

type tableColumn = {
  dataIndex: string;
  title: string;
};

const {
  activeMimePolicyForm,
  activeMimePolicy,
  enableAllMimeTypesInMimePolicy,
  handleGetMimePolicy,
  disableAllMimeTypesInMimePolicy,
  handleUpdateMimeType,
  loading,
} = useMimesPolicies();

const customOperations = ref({
  right: t('MIME_POLICIES.MIME_TYPE_TABLE.ADD_TO_LIST'),
  left: t('MIME_POLICIES.MIME_TYPE_TABLE.REMOVE_FROM_LIST'),
});

const customTitle = computed(() => {
  return {
    source: t('MIME_POLICIES.MIME_TYPE_TABLE.SOURCE'),
    list: activeMimePolicyForm.value.unknownTypeAllowed
      ? t('MIME_POLICIES.MIME_TYPE_OPTIONS.BLACKLIST')
      : t('MIME_POLICIES.MIME_TYPE_OPTIONS.WHITELIST'),
  };
});

const mimeTypes = computed(() => {
  return activeMimePolicy.value?.mimeTypes ?? [];
});

const originTargetKeys: Ref<string[]> = ref([]);

const leftTableColumns = [
  {
    dataIndex: 'mimeType',
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.MIME_TYPE_NAME'),
    sorter: (a: MimeType, b: MimeType) => a.mimeType.localeCompare(b.mimeType),
  },
  {
    dataIndex: 'extensions',
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.EXTENTION'),
    align: 'center',
    sorter: (a: MimeType, b: MimeType) => a.extensions.localeCompare(b.extensions),
    defaultSortOrder: 'descend',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'mimeType',
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.MIME_TYPE_NAME'),
    sorter: (a: MimeType, b: MimeType) => a.mimeType.localeCompare(b.mimeType),
  },
  {
    dataIndex: 'extensions',
    title: t('MIME_POLICIES.MIME_TYPE_TABLE.EXTENTION'),
    align: 'center',
    sorter: (a: MimeType, b: MimeType) => a.extensions.localeCompare(b.extensions),
    defaultSortOrder: 'descend',
  },
];

const targetKeys = ref<string[]>();
const leftColumns = ref<tableColumn[]>(leftTableColumns);
const rightColumns = ref<tableColumn[]>(rightTableColumns);

async function enableAllMime() {
  await enableAllMimeTypesInMimePolicy(activeMimePolicyForm.value.uuid);
  await handleGetMimePolicy(activeMimePolicyForm.value.uuid);
}

async function disableAllMime() {
  await disableAllMimeTypesInMimePolicy(activeMimePolicyForm.value.uuid);
  await handleGetMimePolicy(activeMimePolicyForm.value.uuid);
}

const onChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  targetKeys.value = nextTargetKeys;
  const itemsWithoutKey = combinedList.value.map(({ key, ...rest }) => rest);

  if (!activeMimePolicyForm.value.unknownTypeAllowed) {
    const itemsToUpdateRight = itemsWithoutKey.filter(
      (item) => moveKeys.includes(item.uuid) && !originTargetKeys.value.includes(item.uuid)
    );
    if (combinedList.value.length === targetKeys.value.length) {
      enableAllMime();
    } else {
      itemsToUpdateRight.forEach((item) => {
        item.enable = true;
        handleUpdateMimeType(item);
      });
    }

    const itemsToUpdateLeft = itemsWithoutKey.filter(
      (item) => moveKeys.includes(item.uuid) && originTargetKeys.value.includes(item.uuid)
    );
    if (targetKeys.value?.length === 0) {
      disableAllMime();
    } else {
      itemsToUpdateLeft.forEach((item) => {
        item.enable = false;
        handleUpdateMimeType(item);
      });
    }
  } else {
    const itemsToUpdateRight = itemsWithoutKey.filter(
      (item) => moveKeys.includes(item.uuid) && !originTargetKeys.value.includes(item.uuid)
    );
    if (combinedList.value.length === targetKeys.value.length) {
      disableAllMime();
    } else {
      itemsToUpdateRight.forEach((item) => {
        item.enable = false;
        handleUpdateMimeType(item);
      });
    }

    const itemsToUpdateLeft = itemsWithoutKey.filter(
      (item) => moveKeys.includes(item.uuid) && originTargetKeys.value.includes(item.uuid)
    );
    if (targetKeys.value?.length === 0) {
      enableAllMime();
    } else {
      itemsToUpdateLeft.forEach((item) => {
        item.enable = true;
        handleUpdateMimeType(item);
      });
    }
  }
};

const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }: Record<string, any>) => {
  return {
    getCheckboxProps: (item: Record<string, string | boolean>) => ({
      disabled: disabled || item.disabled,
    }),
    onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
      const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
      onItemSelectAll(treeSelectedKeys, selected);
    },
    onSelect({ key }: Record<string, string>, selected: boolean) {
      onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
  };
};

const filterOption = (inputValue: string, option: MimeType) => {
  const lowerCaseInput = inputValue.toLowerCase();
  return (
    option.mimeType.toLowerCase().indexOf(lowerCaseInput) > -1 ||
    option.extensions.toLowerCase().indexOf(lowerCaseInput) > -1
  );
};

async function checkEnableStatus() {
  try {
    loading.value = true;
    if (activeMimePolicyForm.value.unknownTypeAllowed) {
      originTargetKeys.value = mimeTypes.value.filter((item) => !item.enable).map((item) => item.uuid);
      targetKeys.value = originTargetKeys.value;
    } else {
      originTargetKeys.value = mimeTypes.value.filter((item) => item.enable).map((item) => item.uuid);
      targetKeys.value = originTargetKeys.value;
    }
  } finally {
    loading.value = false;
  }
}

const combinedList = computed(() => {
  const leftList = mimeTypes.value.filter(
    (item) =>
      !originTargetKeys.value.includes(item.uuid) &&
      (!activeMimePolicyForm.value.unknownTypeAllowed || (activeMimePolicyForm.value.unknownTypeAllowed && item.enable))
  );

  const rightList = mimeTypes.value.filter(
    (item) =>
      originTargetKeys.value.includes(item.uuid) &&
      ((activeMimePolicyForm.value.unknownTypeAllowed && !item.enable) ||
        (!activeMimePolicyForm.value.unknownTypeAllowed && item.enable))
  );

  return [...leftList, ...rightList];
});

watchEffect(() => {
  checkEnableStatus();
});
</script>

<style lang="less">
.ant-transfer-list {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 5px;

  .ant-transfer-list-header {
    display: flex;
    background-color: #fafafa;
    border-bottom: 1px solid #d9d9d9;
    align-items: center;
  }

  .ant-transfer-list-content {
    padding: 8px;
  }

  .ant-transfer-list-body {
    max-height: calc(100vh - 220px);
    width: auto;
    overflow-y: auto;
  }

  .ant-transfer-list-footer {
    background-color: #ffffff;
    border-top: 1px solid #d9d9d9;
  }
}

.ant-transfer-operation {
  margin-top: 16px;
}

.ant-btn.ant-btn-primary.ant-btn-sm {
  border-radius: 4px;
  width: auto;
  height: auto;
}

.ant-transfer-list-header-title {
  color: black;
  font-size: 16px;
  font-weight: normal;
  margin-left: 10px;
}

.spin {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
