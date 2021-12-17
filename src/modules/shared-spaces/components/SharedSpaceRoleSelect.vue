<template>
  <a-select
    v-model:value="selectedRoleUuid"
    :options="roleOptions"
    @change="onRoleChange"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { SHARED_SPACE_TYPE } from '../types/SharedSpace';
import SharedSpaceRole from '../types/SharedSpaceRole';

interface Props {
  type: SHARED_SPACE_TYPE;
  uuid?: string;
}

const store = useStore();
const { t } = useI18n();
const props = withDefaults(defineProps<Props>(), {
  type: SHARED_SPACE_TYPE.WORKGROUP,
  uuid: ''
});
const emit = defineEmits(['change']);

const roles: SharedSpaceRole[] = store.getters['SharedSpace/getRolesByType'](props.type);
const roleOptions = ref(roles.map(role => ({
  value: role.uuid,
  label: computed(() => t(`SHARED_SPACES.ROLE.${role.name}`)),
  disabled: !role.enabled
})));
const selectedRoleUuid = ref(props.uuid || roles[0].uuid);

function onRoleChange (uuid: string) {
  emit('change', roles.find(role => role.uuid === uuid));
}
</script>
