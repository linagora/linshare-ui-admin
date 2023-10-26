<template>
  <div class="system-informations">
    <h3 class="section-title">{{ $t('MIME_POLICIES.SYSTEM_INFORMATIONS') }}</h3>
    <div class="info-block">
      <IdentifierIcon class="system-icon"></IdentifierIcon>
      <div>
        <div class="title">{{ $t('TECHNICAL_ACCOUNTS.DETAIL_PAGE.IDENTIFIER') }}</div>
        <div class="value">
          <span> {{ technicalAccountDetails.uuid }} </span>
        </div>
      </div>
    </div>
    <div class="info-block">
      <UserIcon class="system-icon"></UserIcon>
      <div>
        <div class="title">{{ $t('GENERAL.ROLE') }}</div>
        <div class="value">
          <span> {{ technicalAccountDetails.role }} </span>
        </div>
      </div>
    </div>
    <div class="info-block">
      <CalendarIcon class="system-icon"></CalendarIcon>
      <div>
        <div class="title">{{ $t('GENERAL.CREATION_DATE') }}</div>
        <div class="value">
          {{ $d(technicalAccountDetails.creationDate ?? 0, 'mediumDate') }}
        </div>
      </div>
    </div>
    <div class="info-block">
      <CalendarIcon class="system-icon"></CalendarIcon>
      <div>
        <div class="title">{{ $t('GENERAL.MODIFICATION_DATE') }}</div>
        <div class="value">
          {{ $d(technicalAccountDetails.creationDate ?? 0, 'mediumDate') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import IdentifierIcon from '@/core/components/icons/identifier-icon.vue';
import UserIcon from '@/core/components/icons/user-icon.vue';
import CalendarIcon from '@/core/components/icons/calendar-icon.vue';
import useTechnicalAccount from '../../hooks/useTechnicalAccount';

const { technicalAccountDetails } = useTechnicalAccount();
</script>
<style lang="less">
.system-informations {
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
