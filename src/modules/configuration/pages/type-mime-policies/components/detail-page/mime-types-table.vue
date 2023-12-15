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
import { STATUS } from '@/core/types/Status';
import { MimeType, MimePolicy } from '@/modules/configuration/pages/type-mime-policies/types/MimeType';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  item: MimePolicy;
  items: MimeType[];
  status: STATUS;
  editable?: boolean;
  editing?: boolean;
}>();

const loading = ref(false);
const { t } = useI18n();

type tableColumn = {
  dataIndex: string;
  title: string;
};

const customOperations = ref({
  right: t('MIME_POLICIES.MIME_TYPE_TABLE.ADD_TO_LIST'),
  left: t('MIME_POLICIES.MIME_TYPE_TABLE.REMOVE_FROM_LIST'),
});

const customTitle = ref({
  source: t('MIME_POLICIES.MIME_TYPE_TABLE.SOURCE'),
  list: props.item.unknownTypeAllowed
    ? t('MIME_POLICIES.MIME_TYPE_OPTIONS.BLACKLIST')
    : t('MIME_POLICIES.MIME_TYPE_OPTIONS.WHITELIST'),
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

const onChange = (nextTargetKeys: string[]) => {
  targetKeys.value = nextTargetKeys;
  if (!props.item.unknownTypeAllowed) {
    const itemsToUpdateRight = props.items.filter(
      (item) => nextTargetKeys.includes(item.uuid) && !originTargetKeys.value.includes(item.uuid)
    );
    itemsToUpdateRight.forEach((item) => {
      item.enable = true;
    });
    const itemsToUpdateLeft = props.items.filter(
      (item) => !nextTargetKeys.includes(item.uuid) && originTargetKeys.value.includes(item.uuid)
    );
    itemsToUpdateLeft.forEach((item) => {
      item.enable = false;
    });
  } else {
    const itemsToUpdateRight = props.items.filter(
      (item) => nextTargetKeys.includes(item.uuid) && !originTargetKeys.value.includes(item.uuid)
    );
    itemsToUpdateRight.forEach((item) => {
      item.enable = false;
    });
    const itemsToUpdateLeft = props.items.filter(
      (item) => !nextTargetKeys.includes(item.uuid) && originTargetKeys.value.includes(item.uuid)
    );
    itemsToUpdateLeft.forEach((item) => {
      item.enable = true;
    });
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
    if (props.item.unknownTypeAllowed) {
      originTargetKeys.value = props.items.filter((item) => !item.enable).map((item) => item.uuid);
      targetKeys.value = originTargetKeys.value;
    } else {
      originTargetKeys.value = props.items.filter((item) => item.enable).map((item) => item.uuid);
      targetKeys.value = originTargetKeys.value;
    }
  } finally {
    loading.value = false;
  }
}

const combinedList = computed(() => {
  const leftList = props.items.filter(
    (item) =>
      !originTargetKeys.value.includes(item.uuid) &&
      (!props.item.unknownTypeAllowed || (props.item.unknownTypeAllowed && item.enable))
  );

  const rightList = props.items.filter(
    (item) =>
      originTargetKeys.value.includes(item.uuid) &&
      ((props.item.unknownTypeAllowed && !item.enable) || (!props.item.unknownTypeAllowed && item.enable))
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
    width: 550px;
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
