<template>
  <div v-for="(member, index) in props.data" :key="index + '_shared_space_members_small_table'" class="list-item">
    <a-card>
      <a-row :gutter="20">
        <a-col :xs="12" :sm="6">
          <div class="info-block">
            <div class="info-block__name">
              <router-link :to="{ name: 'UserDetail', params: { id: member.account.uuid } }">
                <span class="elipsis-name" :title="member.account.firstName + ' ' + member.account.lastName"
                  >{{ member.account.firstName }} {{ member.account.lastName }}</span
                >
                <br />
                <a-avatar class="info-block__avatar" shape="circle" :size="56">
                  {{ member.account.firstName.charAt(0) }}
                </a-avatar>
              </router-link>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="8">
          <div class="info-block visible-xs">
            <div class="info-block__value">
              {{ member.account.firstName }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.ROLE') }}
            </div>
            <div class="info-block">
              <a-tag color="green">{{ `${$t(`SHARED_SPACES.ROLE.${member.role.name}`)}` }} </a-tag>
              <a-tag v-if="member.nestedRole?.name && member.node.nodeType === 'WORK_SPACE'" color="cyan">
                {{
                  `${$t('SHARED_SPACES.MEMBERS.DEFAULT_ROLE_TAG_PREFIX')} ${$t(
                    `SHARED_SPACES.ROLE.${member.nestedRole?.name}`
                  )}`
                }}</a-tag
              >
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="7">
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.CREATION_DATE') }}
            </div>
            <div class="info-block__value">
              {{ $d(member.creationDate as any, 'mediumDate') }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.UPDATE_TIME_RELATIVE') }}
            </div>
            <div class="info-block__value" :title="$d(member.modificationDate as any, 'mediumDate')">
              {{ useRelativeTime(member.modificationDate as any)?.value }}
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="3">
          <div class="info-block">
            <div class="info-block__value">
              <a-button class="edit-button" type="primary" :title="$t('GENERAL.EDIT')" @click="showRoleModal(member)">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-popconfirm
                :title="$t('SHARED_SPACES.MEMBERS.CONFIRM_DELETE')"
                :ok-text="$t('GENERAL.YES')"
                :cancel-text="$t('GENERAL.NO')"
                placement="top"
                overlay-class-name="popconfirm-delete"
                @confirm="handleDelete(member)"
              >
                <a-button
                  type="primary"
                  :loading="getLoadingStateByMember(member.account.uuid)"
                  :title="$t('GENERAL.DELETE')"
                  danger
                  @click="currentMember.uuid = member.account.uuid"
                >
                  <template #icon>
                    <DeleteFilled />
                  </template>
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>

  <SharedSpaceMemberRoleModal
    :visible="showingRoleModal"
    :member="currentMember"
    @role-updated="onMemberUpdate"
    @cancel="showingRoleModal = false"
  />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { SharedSpaceMember, EMPTY_SHARED_SPACE_MEMBER } from '../types/SharedSpaceMember';
import useSharedSpaceMemberList from '../hooks/useSharedSpaceMemberList';
import { message } from 'ant-design-vue';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { APIError } from '@/core/types/APIError';
import SharedSpaceMemberRoleModal from './shared-space-member-role-modal.vue';
import { DeleteFilled, EditOutlined } from '@ant-design/icons-vue';
import { removeSharedSpaceMember } from '../services/shared-space-api';

const props = defineProps<{
  data: SharedSpaceMember[];
}>();
const currentMember = reactive<SharedSpaceMember>({ ...EMPTY_SHARED_SPACE_MEMBER });
const showingRoleModal = ref(false);
const loading = ref(false);
const deleting = ref(false);
const { t } = useI18n();
const { handleTableChange } = useSharedSpaceMemberList();

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

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.delete_text {
  color: @error-color;
}

.elipsis-name {
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
}
.list-item {
  cursor: pointer;
  margin: 15px 0px;

  .info-block {
    padding: 5px;
    margin-bottom: 20px;

    &__name {
      font-size: 14px;
      font-weight: 600;
    }
    &__avatar {
      background-color: @primary-color;
      color: @component-background;
      margin-left: 20px;
    }

    &__title {
      color: @text-color-secondary;
    }

    &__value {
      display: flex;
    }
  }

  .visible-xs {
    display: none;
    @media (max-width: 575px) {
      display: block;
    }
  }
  .edit-button {
    margin-right: 2px;
  }
}
</style>
<style lang="less">
.popconfirm-delete {
  max-width: 350px;
  min-width: 350px;
}
</style>
