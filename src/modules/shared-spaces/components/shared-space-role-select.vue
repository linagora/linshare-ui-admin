<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSharedSpacesStore } from '@/modules/shared-spaces/store';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import type SharedSpaceRole from '../types/SharedSpaceRole';
import { UserOutlined, TeamOutlined } from '@ant-design/icons-vue';

interface Props {
  type: SHARED_SPACE_TYPE;
  uuid?: string;
}

const sharedSpacesStore = useSharedSpacesStore();
const { t } = useI18n();
const props = withDefaults(defineProps<Props>(), {
  type: SHARED_SPACE_TYPE.WORKGROUP,
  uuid: '',
});
const emit = defineEmits(['change']);

const roles: SharedSpaceRole[] = sharedSpacesStore.getRolesByType(props.type);
const roleOptions = ref(
  roles.map((role) => ({
    value: role.uuid,
    label: t(`SHARED_SPACES.ROLE.${role.name}`),
    disabled: !role.enabled,
  }))
);
const selectedRoleUuid = ref(props.uuid || roles[0].uuid);

function onRoleChange(uuid: string) {
  emit(
    'change',
    roles.find((role) => role.uuid === uuid)
  );
}

watchEffect(() => {
  if (roles.some((role) => role.uuid === props.uuid)) {
    selectedRoleUuid.value = props.uuid;
  } else {
    selectedRoleUuid.value = roles[0].uuid;
  }
});
</script>

<template>
  <a-select v-model:value="selectedRoleUuid" :options="roleOptions" @change="onRoleChange">
    <template #suffixIcon>
      <TeamOutlined v-if="type === SHARED_SPACE_TYPE.WORKSPACE" />
      <UserOutlined v-else />
    </template>
  </a-select>
</template>
