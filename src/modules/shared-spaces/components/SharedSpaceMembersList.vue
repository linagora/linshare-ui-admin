<template>
  <div class="toolbar">
    <a-input
      v-model:value="filterText"
      class="filter-input"
      allow-clear
      :placeholder="$t('SHARED_SPACES.MEMBERS.FILTER_PLACEHOLDER')"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>

    <a-button
      type="primary"
      style="margin-left: 5px"
      @click="showingAddModal = true"
    >
      <template #icon>
        <PlusCircleOutlined />
      </template>

      {{ $t('SHARED_SPACES.MEMBERS.ADD_NEW') }}
    </a-button>
  </div>

  <a-list
    item-layout="horizontal"
    :data-source="filteredList"
    :loading="loading"
  >
    <template #renderItem="{ item }">
      <SharedSpaceMembersListItem
        :data="item"
        @edit-role="() => showRoleModal(item)"
        @deleted="onMemberDelete"
      />
    </template>
  </a-list>

  <SharedSpaceMembersAddModal
    :shared-space="sharedSpace"
    :visible="showingAddModal"
    :members="list"
    @members-added="onMembersAdded"
    @cancel="showingAddModal = false"
  />

  <SharedSpaceMemberRoleModal
    :visible="showingRoleModal"
    :member="editingMember"
    @role-updated="onMemberUpdate"
    @cancel="showingRoleModal = false"
  />
</template>

<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { getSharedSpaceMembers } from '../services/shared-space-api';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import SharedSpaceMembersListItem from './SharedSpaceMembersListItem.vue';
import SharedSpaceMembersAddModal from './SharedSpaceMembersAddModal.vue';
import SharedSpaceMemberRoleModal from './SharedSpaceMemberRoleModal.vue';
import SharedSpace from '../types/SharedSpace';
import SharedSpaceMember, { EMPTY_SHARED_SPACE_MEMBER } from '../types/SharedSpaceMember';

const props = defineProps<{ sharedSpace: SharedSpace; }>();
const filterText = ref('');
const showingAddModal = ref(false);
const showingRoleModal = ref(false);
const loading = ref(false);
const list = ref<SharedSpaceMember[]>([]);
const editingMember = reactive<SharedSpaceMember>({ ...EMPTY_SHARED_SPACE_MEMBER });
const filteredList = computed<SharedSpaceMember[]>(() => {
  if (!filterText.value) {
    return list.value;
  }

  return list.value.filter(member => [
    member.account.mail,
    member.account.firstName,
    member.account.lastName
  ].some(fieldValue => fieldValue.toUpperCase().includes(filterText.value.toUpperCase())));
});

function showRoleModal (member: SharedSpaceMember) {
  showingRoleModal.value = true;
  Object.assign(editingMember, member);
}

function onMemberUpdate (updated: SharedSpaceMember) {
  showingRoleModal.value = false;
  const target = list.value.find(member => member.uuid === updated.uuid);

  if (target) {
    Object.assign(target, updated);
  }
}

function onMemberDelete (deleted: SharedSpaceMember) {
  list.value = list.value.filter(member => member.uuid !== deleted.uuid);
}

function onMembersAdded () {
  fetchSharedSpaceMembers();
  showingAddModal.value = false;
}

function fetchSharedSpaceMembers () {
  loading.value = true;

  getSharedSpaceMembers(props.sharedSpace.uuid)
    .then(members => {
      list.value = members;
    }).finally(() => {
      loading.value = false;
    });
}

onMounted(fetchSharedSpaceMembers);
</script>

<style lang="less" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;

  .filter-input {
    max-width: 400px;
  }
}
</style>
