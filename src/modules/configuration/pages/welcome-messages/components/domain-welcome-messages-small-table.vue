<template>
  <div v-for="(message, index) in filteredListByPage" :key="index + '_wecome_messsages_small_table'" class="list-item">
    <a-card>
      <a-row :gutter="20">
        <a-col :xs="12" :sm="6">
          <div class="info-block">
            <div class="info-block__name">
              <router-link
                :to="{
                  name: 'DomainWelcomeMessageDetails',
                  params: { uuid: message.uuid, domainUuid: currentDomain.uuid },
                }"
              >
                <span class="elipsis-name" :title="message.name">{{ message.name }}</span>
              </router-link>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="8">
          <div class="info-block visible-xs">
            <div class="info-block__title">
              {{ $t('GENERAL.READ_ONLY') }}
            </div>
            <div class="info-block__value">
              {{ message.readOnly }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.DOMAIN') }}
            </div>
            <div class="info-block__value">
              {{ message.domain?.name }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.ASSIGNED') }}
            </div>
            <div class="info-block__value">
              <a-tag v-if="message.assignedToCurrentDomain === true" color="success">
                {{ $t('GENERAL.ASSIGNED') }}
              </a-tag>
              <a-tag v-else color="red">
                {{ $t('GENERAL.UNASSIGNED') }}
              </a-tag>
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.READ_ONLY') }}
            </div>
            <div class="info-block__value">
              <a-tag v-if="message.assignedToCurrentDomain === true" color="red">
                {{ $t('GENERAL.READ_ONLY') }}
              </a-tag>
              <a-tag v-if="message.assignedToCurrentDomain === false" color="success">
                {{ $t('GENERAL.EDITABLE') }}
              </a-tag>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="7">
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.CREATION_DATE') }}
            </div>
            <div class="info-block__value">
              {{ $d(message.creationDate as any, 'mediumDate') }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.MODIFICATION_DATE') }}
            </div>
            <div class="info-block__value">
              {{ $d(message.modificationDate as any, 'mediumDate') }}
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="3">
          <div class="info-block">
            <div class="info-block__title">
              {{ $t('GENERAL.ACTIONS') }}
            </div>
            <div class="info-block__value">
              <a-dropdown>
                <EllipsisOutlined />
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-if="currentDomain.type !== DOMAIN_TYPE.ROOT"
                      :disabled="message.assignedToCurrentDomain === true"
                      @click="onAssign(message)"
                    >
                      {{ $t('GENERAL.ASSIGN') }}
                    </a-menu-item>
                    <a-menu-item @click="onDupplicate(message)">
                      {{ $t('GENERAL.DUPLICATE') }}
                    </a-menu-item>
                    <a-menu-item @click="onView(message)">
                      {{ $t(message.readOnly ? 'GENERAL.VIEW' : 'GENERAL.EDIT') }}
                    </a-menu-item>
                    <a-menu-item v-if="canDeleteMessage(message)" @click="onDelete(message)">
                      <span class="delete_text"> {{ $t('GENERAL.DELETE') }} </span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { useDomainStore } from '@/modules/domain/store';
import { DOMAIN_TYPE } from '@/modules/domain/types/Domain';
import WelcomeMessage from '../types/WelcomeMessages';
import useWelcomeMessages from '../hooks/useWelcomeMessages';
import useNotification from '@/core/hooks/useNotification';

const { confirmModal } = useNotification();
const { t } = useI18n();
const { filteredListByPage, assign, remove, view, dupplicate, canDeleteMessage } = useWelcomeMessages();

const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);

function onAssign(welcomeMessage: WelcomeMessage) {
  confirmModal({
    title: t('GENERAL.ASSIGN'),
    content: t('WELCOME_MESSAGES.ASSIGN_CONFIRM'),
    okText: t('GENERAL.YES'),
    onOk: () => assign(welcomeMessage),
  });
}

async function onDelete(welcomeMessage: WelcomeMessage) {
  confirmModal({
    title: t('GENERAL.DELETION'),
    content: t('WELCOME_MESSAGES.DELETE_CONFIRM'),
    okText: t('GENERAL.DELETE'),
    onOk: () => remove(welcomeMessage),
  });
}

function onDupplicate(welcomeMessage: WelcomeMessage) {
  dupplicate(welcomeMessage);
}

function onView(welcomeMessage: WelcomeMessage) {
  view(welcomeMessage);
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

    &__title {
      color: @text-color-secondary;
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
