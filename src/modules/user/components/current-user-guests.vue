<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useDomainStore } from '@/modules/domain/store';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import type { Guest } from '@/modules/user/types/GuestList';

const { t } = useI18n();
const loading = ref(false);
const domainStore = useDomainStore();
const props = defineProps<{
  list: Guest[];
}>();
const { getDomainsList: domainsList } = storeToRefs(domainStore);

function getDomainFromUuid(uuid: string) {
  return domainsList.value.find((domain) => domain.uuid === uuid);
}

function relativeDate(date: number) {
  const relativeTime = useRelativeTime(date);
  return relativeTime?.value;
}

const columns = computed(() => [
  {
    title: t('USERS.DETAIL_USER.TYPE_GUEST'),
    key: 'infos',
  },
  {
    title: t('GENERAL.DOMAIN'),
    align: 'center',
    width: 400,
    key: 'domain',
  },
  {
    title: t('GENERAL.UPDATE_TIME_RELATIVE'),
    width: 300,
    key: 'modificationDate',
  },
  {
    title: t('GENERAL.CREATE_AT'),
    width: 300,
    key: 'creationDate',
  },
  {
    title: t('USERS.DETAIL_USER.EXPIRATION_DATE'),
    width: 300,
    key: 'expirationDate',
  },
]);
</script>

<template>
  <a-table class="guest-table" :pagination="false" :columns="columns" :data-source="props.list" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'infos'">
        <router-link :to="{ name: 'UserDetail', params: { id: record.uuid } }">
          <div class="guest-infos">
            <div>
              <a-avatar shape="circle" :size="56" class="profile-avatar">
                {{ record.firstName.charAt(0) }}
              </a-avatar>
            </div>
            <div>
              <span class="guest-name"> {{ record.firstName }} {{ record.lastName }} </span>

              <br />
              <span class="guest-mail">{{ record.mail }}</span>
            </div>
          </div>
        </router-link>
      </template>
      <template v-if="column.key === 'domain'">
        <router-link :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: record.domain } }">
          {{ getDomainFromUuid(record.domain)?.name }}
        </router-link>
      </template>
      <template v-if="column.key === 'modificationDate'">
        <span :title="$d(record.modificationDate, 'mediumDate')">{{ relativeDate(record.modificationDate) }}</span>
      </template>
      <template v-if="column.key === 'creationDate'">
        <span>{{ $d(record.creationDate, 'mediumDate') }}</span>
      </template>
      <template v-if="column.key === 'expirationDate'">
        <span>{{ $d(record.expirationDate, 'mediumDate') }}</span>
      </template>
    </template>
  </a-table>
</template>

<style lang="less">
.guest-table {
  margin-top: 10px;
}
.guest-name {
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
  color: black;
}
.guest-mail {
  color: @text-color-secondary;
}
.profile-avatar {
  background-color: @primary-color;
  color: @component-background;
  margin-right: 10px;
}
.guest-infos {
  display: flex;
}
</style>
