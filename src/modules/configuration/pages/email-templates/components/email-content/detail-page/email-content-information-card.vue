<template>
  <div class="email-content-information-card">
    <h3 class="section-title">{{ $t('MIME_POLICIES.SYSTEM_INFORMATIONS') }}</h3>
    <div class="info-block">
      <GlobeIcon class="system-icon"></GlobeIcon>
      <div>
        <div class="title">{{ $t('GENERAL.DOMAIN') }}</div>
        <div class="value">
          <span v-if="!checkingEmailContentsDomainAuthorized(item.domain)"> {{ item?.domainLabel }} </span>
          <router-link v-else :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: props.item.domain } }">
            <a>{{ item?.domainLabel }}</a>
          </router-link>
        </div>
      </div>
    </div>
    <div class="info-block">
      <CalendarIcon class="system-icon"></CalendarIcon>
      <div>
        <div class="title">{{ $t('GENERAL.CREATION_DATE') }}</div>
        <div class="value">{{ $d(item?.creationDate ?? 0, 'mediumDate') }}</div>
      </div>
    </div>
    <div class="info-block">
      <CalendarIcon class="system-icon"></CalendarIcon>
      <div>
        <div class="title">{{ $t('GENERAL.MODIFICATION_DATE') }}</div>
        <div class="value">{{ $d(item?.modificationDate ?? 0, 'mediumDate') }}</div>
      </div>
    </div>
    <div class="info-block">
      <CalendarIcon class="system-icon"></CalendarIcon>
      <div>
        <div class="title">{{ $t('EMAIL_TEMPLATES.MAIL_CONTENT_TYPE_NAME') }}</div>
        <div class="value">
          {{ item?.mailContentType }} : {{ $t(`EMAIL_TEMPLATES.MAIL_CONTENT_TYPE.${item?.mailContentType}`) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import CalendarIcon from '@/core/components/icons/calendar-icon.vue';
import { MailContent } from '@/modules/configuration/pages/email-templates/types/MailContent';
import useEmailTemplatesContent from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesContent';

const props = defineProps<{
  item: MailContent;
}>();
const { checkingEmailContentsDomainAuthorized } = useEmailTemplatesContent();
</script>
<style lang="less">
.email-content-information-card {
  border-radius: 12px;
  background-color: #fafafa;
  padding: 16px;

  .title {
    color: #6d7885;
    white-space: pre-wrap;
  }
  .value {
    white-space: pre-wrap;
  }
}

.info-block {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  overflow: hidden;
}

.system-icon {
  width: 20px;
  height: 20px;
  min-width: 20px;
  margin-right: 10px;
  color: #6d7885;
}

.section-title {
  margin-bottom: 15px;
  color: #434657;
}
</style>
