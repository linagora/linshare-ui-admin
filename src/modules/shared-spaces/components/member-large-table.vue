<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { SharedSpaceMember, EMPTY_SHARED_SPACE_MEMBER } from '../types/SharedSpaceMember';
import { removeSharedSpaceMember } from '../services/shared-space-api';
import { message } from 'ant-design-vue';
import SharedSpaceMemberRoleModal from './shared-space-member-role-modal.vue';
import { APIError } from '@/core/types/APIError';
import useSharedSpaceMemberList from '../hooks/useSharedSpaceMemberList';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { DeleteFilled, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons-vue';

const { t } = useI18n();
const currentMember = reactive<SharedSpaceMember>({ ...EMPTY_SHARED_SPACE_MEMBER });
const showingRoleModal = ref(false);
const loading = ref(false);
const deleting = ref(false);
const { handleTableChange } = useSharedSpaceMemberList();

const props = defineProps<{
  data: SharedSpaceMember[];
}>();
const columns = computed(() => [
  {
    title: t('SHARED_SPACES.MEMBERS.MEMBERS'),
    key: 'infos',
  },
  {
    title: t('GENERAL.ROLE'),
    dataIndex: ['role', 'name'],
    align: 'center',
    width: 500,
    key: 'role',
  },
  {
    title: t('GENERAL.UPDATE_TIME_RELATIVE'),
    align: 'center',
    dataIndex: ['modificationDate'],
    width: 400,
    key: 'modificationDate',
  },
  {
    title: t('USERS.DETAIL_USER.CREATION_DATE'),
    align: 'center',
    width: 400,
    dataIndex: ['creationDate'],
    key: 'creationDate',
  },
  {
    key: 'action',
    align: 'left',
    width: '200px',
  },
]);

function getLoadingStateByMember(id: string) {
  if (id === currentMember.uuid && deleting.value === true) return true;
  return false;
}

async function handleDelete(member: SharedSpaceMember) {
  try {
    deleting.value = true;

    await removeSharedSpaceMember(member);
    await handleTableChange();
    message.success(t('MESSAGES.DELETE_SUCCESS'));
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  } finally {
    deleting.value = false;
  }
}

function showRoleModal(member: SharedSpaceMember) {
  showingRoleModal.value = true;
  Object.assign(currentMember, member);
}

function onMemberUpdate(updated: SharedSpaceMember) {
  showingRoleModal.value = false;
  const target = props.data.find((member) => member.uuid === updated.uuid);

  if (target) {
    Object.assign(target, updated);
  }
}
</script>

<template>
  <a-table class="member-table" :columns="columns" :data-source="props.data" :loading="loading" :pagination="false">
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'infos'">
        <router-link :to="{ name: 'UserDetail', params: { id: record.account.uuid } }">
          <div class="member-infos">
            <div>
              <a-avatar shape="circle" :size="56" class="profile-avatar">
                {{ record.account.firstName.charAt(0) }}
              </a-avatar>
            </div>
            <div>
              <span class="member-name"> {{ record.account.firstName }} {{ record.account.lastName }}</span
              ><br />
              <span class="member-mail">{{ record.account.mail }}</span>
            </div>
          </div>
        </router-link>
      </template>
      <template v-if="column.key === 'role'">
        <a-tag color="green">
          {{ `${$t(`SHARED_SPACES.ROLE.${text}`)}` }}
        </a-tag>
        <a-tag v-if="record.nestedRole?.name && record.node.nodeType === 'WORK_SPACE'" color="cyan">
          <a-tooltip>
            <template #title>
              {{ $t('SHARED_SPACES.MEMBERS.DEFAULT_ROLE_TAG_TOOLTIP') }}
            </template>
            {{
              `${$t('SHARED_SPACES.MEMBERS.DEFAULT_ROLE_TAG_PREFIX')} ${$t(
                `SHARED_SPACES.ROLE.${record.nestedRole?.name}`
              )}`
            }}
          </a-tooltip>
        </a-tag>
        <a-tag v-else-if="!record.nestedRole?.name && record.node.nodeType === 'WORK_SPACE'" color="cyan">
          <a-tooltip>
            <template #title>
              {{ $t('SHARED_SPACES.MEMBERS.DEFAULT_ROLE_TAG_TOOLTIP') }}
            </template>

            {{ $t('SHARED_SPACES.MEMBERS.NO_DEFAULT_ROLE') }}
          </a-tooltip>
        </a-tag>
      </template>
      <template v-if="column.key === 'modificationDate'"
        ><span :title="$d(text, 'mediumDate')">{{ useRelativeTime(text)?.value }}</span></template
      >
      <template v-if="column.key === 'creationDate'"
        ><span>{{ $d(text, 'mediumDate') }}</span></template
      >
      <template v-if="column.key === 'action'">
        <a-button class="edit-button" type="primary" :title="$t('GENERAL.EDIT')" @click="showRoleModal(record)">
          {{ $t('GENERAL.EDIT') }}
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
        <a-popconfirm
          :title="$t('SHARED_SPACES.MEMBERS.CONFIRM_DELETE')"
          :ok-text="$t('GENERAL.YES')"
          :cancel-text="$t('GENERAL.NO')"
          placement="top"
          @confirm="handleDelete(record)"
        >
          <template #icon>
            <QuestionCircleOutlined />
          </template>
          <a-button
            type="primary"
            :title="$t('GENERAL.DELETE')"
            :loading="getLoadingStateByMember(record.account.uuid)"
            danger
            @click="currentMember.uuid = record.account.uuid"
          >
            <template #icon>
              <DeleteFilled />
            </template>
          </a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <SharedSpaceMemberRoleModal
    :visible="showingRoleModal"
    :member="currentMember"
    @role-updated="onMemberUpdate"
    @cancel="showingRoleModal = false"
  />
</template>

<style lang="less" scoped>
.member-name {
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
  color: black;
}
.member-mail {
  color: @text-color-secondary;
}

.profile-avatar {
  background-color: @primary-color;
  color: @component-background;
  margin-right: 10px;
}
.member-infos {
  display: flex;
}
.edit-button {
  margin-right: 10px;
}
.member-table {
  margin-top: 15px;
}
</style>
