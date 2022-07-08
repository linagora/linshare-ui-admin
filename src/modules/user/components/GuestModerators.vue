<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { DeleteFilled, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/modules/user/store';
import { APIError } from '@/core/types/APIError';
import { listGuestModerators, removeGuestModerator, updateGuestModerator } from '../services/guest-api';
import GuestModerator, { GUEST_MODERATOR_ROLE } from '../types/GuestModerator';
import GuestModeratorAddModal from './GuestModeratorAddModal.vue';

const { t } = useI18n();
const list = ref<GuestModerator[]>([]);

const userStore = useUserStore();
const { user: currentUser } = storeToRefs(userStore);

const filterText = ref('');
const loading = ref(false);
const showingAddModal = ref(false);
const deleting = reactive<Record<string, boolean>>({});
const filteredList = computed(() =>
  list.value.filter((moderator) => moderator.account.name?.toLowerCase().includes(filterText.value.toLowerCase()))
);
const columns = computed(() => [
  {
    width: '46px',
    key: 'avatar',
  },
  {
    title: t('GENERAL.NAME'),
    dataIndex: ['account', 'name'],
    sorter: (a: GuestModerator, b: GuestModerator) => a.account.name?.localeCompare(b.account.name || ''),
    align: 'left',
    key: 'name',
  },
  {
    title: t('USERS.DETAIL_USER.MAIL'),
    dataIndex: ['account', 'email'],
    sorter: (a: GuestModerator, b: GuestModerator) => a.account.email?.localeCompare(b.account.email || ''),
    align: 'left',
    key: 'email',
  },
  {
    title: t('GENERAL.DOMAIN'),
    dataIndex: ['account', 'domain', 'name'],
    sorter: (a: GuestModerator, b: GuestModerator) =>
      a.account.domain?.name.localeCompare(b.account.domain?.name || ''),
    align: 'left',
    key: 'domain',
  },
  {
    title: t('GENERAL.ROLE'),
    align: 'center',
    dataIndex: 'role',
    sorter: (a: GuestModerator, b: GuestModerator) => a.role.localeCompare(b.role),
    key: 'role',
  },
  {
    width: '170px',
    title: t('GENERAL.MODIFICATION_DATE'),
    align: 'center',
    dataIndex: 'modificationDate',
    sorter: (a: GuestModerator, b: GuestModerator) => (a.modificationDate || 0) - (b.modificationDate || 0),
    key: 'date',
  },
  {
    width: '170px',
    title: t('GENERAL.CREATION_DATE'),
    align: 'center',
    dataIndex: 'creationDate',
    sorter: (a: GuestModerator, b: GuestModerator) => (a.creationDate || 0) - (b.creationDate || 0),
    key: 'date',
  },
  {
    width: '80px',
    align: 'center',
    key: 'action',
  },
]);

async function fetchGuestModerators() {
  if (!currentUser.value) return;

  loading.value = true;

  try {
    list.value = await listGuestModerators(currentUser.value.uuid);
    loading.value = false;
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}
async function remove(moderator: GuestModerator) {
  if (!currentUser.value) return;

  deleting[moderator.uuid] = true;

  try {
    const deleted = await removeGuestModerator(currentUser.value.uuid, moderator);
    list.value = list.value.filter((e) => e.uuid !== deleted.uuid);
    message.success(t('MESSAGES.DELETE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  } finally {
    deleting[moderator.uuid] = false;
  }
}

async function update(moderator: GuestModerator) {
  if (!currentUser.value) return;

  try {
    const updated = await updateGuestModerator(currentUser.value.uuid, moderator);
    const index = list.value.findIndex((moderator) => moderator.uuid === updated.uuid);

    if (index) {
      list.value[index] = updated;
    }

    message.success(t('MESSAGES.UPDATE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  }
}

function onModeratorsAdded() {
  fetchGuestModerators();
  showingAddModal.value = false;
}

onMounted(fetchGuestModerators);
</script>

<template>
  <div class="toolbar">
    <a-input
      v-model:value="filterText"
      class="filter-input"
      allow-clear
      :placeholder="$t('USERS.GUEST_MODERATOR.FILTER_PLACEHOLDER')"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>

    <a-button type="primary" style="margin-left: 5px" @click="showingAddModal = true">
      <template #icon>
        <PlusCircleOutlined />
      </template>

      {{ $t('USERS.GUEST_MODERATOR.ADD_MODERATOR') }}
    </a-button>
  </div>

  <a-table :pagination="false" :columns="columns" :data-source="filteredList" :loading="loading" row-key="uuid">
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'avatar'">
        <router-link :to="{ name: 'UserDetail', params: { id: record.account.uuid } }">
          <a-avatar shape="circle" :size="46" class="avatar">
            {{ record.account.name.charAt(0) }}
          </a-avatar>
        </router-link>
      </template>

      <template v-else-if="column.key === 'name'">
        <router-link :to="{ name: 'UserDetail', params: { id: record.account.uuid } }">
          {{ text }}
        </router-link>
      </template>

      <template v-else-if="column.key === 'domain'">
        <router-link :to="{ name: 'DomainDetails', params: { domainUuid: record.account.domain.uuid } }">
          {{ text }}
        </router-link>
      </template>

      <template v-else-if="column.key === 'role'">
        <a-select v-model:value="record.role" @change="update(record)">
          <a-select-option :value="GUEST_MODERATOR_ROLE.ADMIN">{{
            $t('USERS.GUEST_MODERATOR.ROLE.ADMIN')
          }}</a-select-option>

          <a-select-option :value="GUEST_MODERATOR_ROLE.SIMPLE">{{
            $t('USERS.GUEST_MODERATOR.ROLE.SIMPLE')
          }}</a-select-option>
        </a-select>
      </template>

      <template v-else-if="column.key === 'date'">
        {{ $d(text, 'mediumDate') }}
      </template>

      <template v-else-if="column.key === 'action'">
        <a-button type="primary" danger :loading="deleting[record.uuid]" @click="remove(record)">
          <template #icon><DeleteFilled /></template>
        </a-button>
      </template>
    </template>
  </a-table>

  <GuestModeratorAddModal
    :visible="showingAddModal"
    :moderators="list"
    @moderators-added="onModeratorsAdded"
    @cancel="showingAddModal = false"
  ></GuestModeratorAddModal>
</template>

<style lang="less">
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;

  .filter-input {
    max-width: 400px;
  }
}

.avatar {
  background-color: @primary-color;
  color: @component-background;
}
</style>
