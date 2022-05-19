<script lang="ts" setup>
import { computed, onMounted, watch, ref, shallowRef } from 'vue';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import SharedSpaceMembersAddModal from './shared-space-members-add-modal.vue';
import TokenInput, { TokenSubmitPayload } from '@/core/components/token-input.vue';
import { useI18n } from 'vue-i18n';
import SharedSpace from '../types/SharedSpace';
import { MemberListFilters } from '../types/SharedSpaceMember';
import ThePagination from '@/core/components/the-pagination.vue';
import AccountAutocompleteItem from '@/modules/user/components/account-autocomplete-item.vue';
import useSharedSpaceMemeberList from '../hooks/useSharedSpaceMemberList';
import { listUsers } from '@/modules/user/services/user-api';
import MemberLargeTable from './member-large-table.vue';
import MemberSmallTable from './member-small-table.vue';
import { useMediaQuery } from '@vueuse/core';
import { LARGE_SCREEN_BREAK_POINT } from '@/core/constants/breakpoint';

const props = defineProps<{ sharedSpace: SharedSpace }>();
const { locale, t } = useI18n();
const showingAddModal = ref(false);
const isLargeScreen = useMediaQuery(LARGE_SCREEN_BREAK_POINT);
const { list, pagination, handleTableChange, filters, sorter } = useSharedSpaceMemeberList();

const searchForAccounts = async function (mail: string) {
  const data = await listUsers({ mail });
  return data.data.map((user) => ({
    label: user.mail,
    value: user.uuid,
    data: user,
    optionComponent: shallowRef(AccountAutocompleteItem),
  }));
};

const sortOptions = [
  {
    key: 'firstName',
    label: 'USERS.DETAIL_USER.FIRST_NAME',
  },
  {
    key: 'modificationDate',
    label: 'USERS.DETAIL_USER.MODIFICATION_DATE',
    default: true,
  },
  {
    key: 'creationDate',
    label: 'USERS.DETAIL_USER.CREATION_DATE',
  },
];

const filterOptions = [
  {
    key: 'pattern',
    displayKey: computed(() => t('SHARED_SPACES.MEMBERS.MEMBER_ADVANCED_RESEARCH', locale.value)),
    default: true,
  },
  {
    key: 'role',
    displayKey: computed(() => t('GENERAL.ROLE', locale.value)),
    options: [],
  },
  {
    key: 'type',
    displayKey: computed(() => t('USERS.DETAIL_USER.ACCOUNT_TYPE', locale.value)),
    options: [
      {
        value: 'INTERNAL',
        label: computed(() => t('USERS.DETAIL_USER.TYPE_INTERNAL', locale.value)),
      },
      {
        value: 'GUEST',
        label: computed(() => t('USERS.DETAIL_USER.TYPE_GUEST', locale.value)),
      },
    ],
  },

  {
    key: 'accountUuid',
    displayKey: computed(() => t('SHARED_SPACES.TOKEN_INPUT.ACCOUNT', locale.value)),
    asyncAutocomplete: searchForAccounts,
  },
];

if (props.sharedSpace.nodeType === 'WORK_SPACE') {
  filterOptions[1].options?.push(
    {
      value: 'WORK_SPACE_ADMIN',
      label: computed(() => t('SHARED_SPACES.ROLE.WORK_SPACE_ADMIN', locale.value)),
    },
    {
      value: 'WORK_SPACE_WRITER',
      label: computed(() => t('SHARED_SPACES.ROLE.WORK_SPACE_WRITER', locale.value)),
    },
    {
      value: 'WORK_SPACE_READER',
      label: computed(() => t('SHARED_SPACES.ROLE.WORK_SPACE_READER', locale.value)),
    }
  );
} else {
  filterOptions[1].options?.push(
    {
      value: 'ADMIN',
      label: computed(() => t('SHARED_SPACES.ROLE.ADMIN', locale.value)),
    },
    {
      value: 'WRITER',
      label: computed(() => t('SHARED_SPACES.ROLE.WRITER', locale.value)),
    },
    {
      value: 'READER',
      label: computed(() => t('SHARED_SPACES.ROLE.READER', locale.value)),
    },
    {
      value: 'CONTRIBUTOR',
      label: computed(() => t('SHARED_SPACES.ROLE.CONTRIBUTOR', locale.value)),
    }
  );
}

const handleSubmit = async function (options: TokenSubmitPayload<MemberListFilters>) {
  if (options.sort) {
    Object.assign(sorter, options.sort);
  }

  filters.value = options.filters;

  await handleTableChange();
};

function onMembersAdded() {
  handleTableChange();
  showingAddModal.value = false;
}

onMounted(handleTableChange);

watch(
  () => props.sharedSpace,
  (newValue: SharedSpace, oldValue: SharedSpace) => {
    if (newValue !== oldValue) {
      handleTableChange;
    }
  }
);
</script>

<template>
  <div class="toolbar">
    <a-button type="primary" @click="showingAddModal = true">
      <template #icon>
        <PlusCircleOutlined />
      </template>

      {{ $t('SHARED_SPACES.MEMBERS.ADD_NEW') }}
    </a-button>
  </div>
  <TokenInput
    :filters="filterOptions"
    :sorts="sortOptions"
    :placeholder="$t('USERS.TOKEN_INPUT.PLACEHOLDER')"
    @submit="handleSubmit"
  />
  <MemberLargeTable v-if="isLargeScreen" :data="list" />
  <MemberSmallTable v-else :data="list" />
  <ThePagination
    v-model="pagination"
    class="shared-spaces-list__pagination"
    :is-visible="!list.length"
    @change="handleTableChange"
  />

  <SharedSpaceMembersAddModal
    :shared-space="sharedSpace"
    :visible="showingAddModal"
    :members="list"
    @members-added="onMembersAdded"
    @cancel="showingAddModal = false"
  />
</template>

<style lang="less" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}
</style>
