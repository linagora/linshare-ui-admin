<template>
  <div v-for="(guest, index) in props.list" :key="index + '_user_guest_small_table'" class="list-item">
    <a-card>
      <a-row :gutter="20">
        <a-col :xs="12" :sm="6">
          <div class="info-block">
            <div class="info-block__name">
              <router-link :to="{ name: 'UserDetail', params: { id: guest.uuid } }">
                <span class="elipsis-name" :title="guest.firstName + ' ' + guest.lastName"
                  >{{ guest.firstName }} {{ guest.lastName }}</span
                >
                <br />
                <a-avatar class="info-block__avatar" shape="circle" :size="56">
                  {{ guest.firstName.charAt(0) }}
                </a-avatar>
              </router-link>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="8">
          <div class="info-block">
            <div class="info-block__title">
              {{ t('USERS.DETAIL_USER.EXPIRATION_DATE') }}
            </div>
            <div class="info-block">
              {{ $d(guest.expirationDate as any, 'mediumDate') }}
            </div>
            <div class="info-block__title">
              {{ t('USERS.DETAIL_USER.MAIL') }}
            </div>
            <div class="info-block">
              {{ guest.mail }}
            </div>
            <div class="info-block__title">
              {{ t('GENERAL.DOMAIN') }}
            </div>
            <div class="info-block">
              <router-link :to="{ name: 'DomainDetails', params: { domainUuid: guest.domain } }">
                {{ getDomainFromUuid(guest.domain)?.name }}
              </router-link>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="7">
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.CREATION_DATE') }}
            </div>
            <div class="info-block__value">
              {{ $d(guest.creationDate as any, 'mediumDate') }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.UPDATE_TIME_RELATIVE') }}
            </div>
            <div class="info-block__value" :title="$d(guest.modificationDate as any, 'mediumDate')">
              {{ useRelativeTime(guest.modificationDate as any)?.value }}
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="3">
          <div class="info-block">
            <div class="info-block__value"></div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
  <div v-if="props.list.length === 0">
    <a-empty :image="simpleImage" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import useRelativeTime from '@/core/hooks/useRelativeTime';
import { useDomainStore } from '@/modules/domain/store';
import type { Guest } from '@/modules/user/types/GuestList';
import { storeToRefs } from 'pinia';
import { Empty } from 'ant-design-vue';

const props = defineProps<{
  list: Guest[];
}>();

const { t } = useI18n();
const domainStore = useDomainStore();
const { getDomainsList: domainsList } = storeToRefs(domainStore);
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

function getDomainFromUuid(uuid: string) {
  return domainsList.value.find((domain) => domain.uuid === uuid);
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
      margin-left: 10px;
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
}
</style>
