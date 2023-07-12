<template>
  <div class="email-footer-information-card">
    <h3 class="section-title">{{ $t('MIME_POLICIES.SYSTEM_INFORMATIONS') }}</h3>
    <div class="info-block">
      <GlobeIcon class="system-icon"></GlobeIcon>
      <div>
        <div class="title">{{ $t('GENERAL.DOMAIN') }}</div>
        <div class="value">
          <span v-if="!checkingEmailFootersDomainAuthorized(item.domain)"> {{ item?.domainName }} </span>
          <router-link v-else :to="{ name: 'ConfigurationDomainDetail', params: { domainUuid: props.item.domain } }">
            <a>{{ item?.domainName }}</a>
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
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
import CalendarIcon from '@/core/components/icons/calendar-icon.vue';
import { MailFooter } from '@/modules/configuration/pages/email-templates/types/MailFooter';
import useEmailTemplatesFooter from '@/modules/configuration/pages/email-templates/hooks/useEmailTemplatesFooter';

const props = defineProps<{
  item: MailFooter;
}>();
const { checkingEmailFootersDomainAuthorized } = useEmailTemplatesFooter();
</script>
<style lang="less">
.email-footer-information-card {
  border-radius: 12px;
  background-color: #fafafa;
  padding: 16px;

  .title {
    color: #6d7885;
  }
}

.info-block {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}

.system-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: #6d7885;
}

.section-title {
  margin-bottom: 15px;
  color: #434657;
}
</style>
