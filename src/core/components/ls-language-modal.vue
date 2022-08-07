<script lang="ts" setup>
import i18nService from '@/core/services/I18nService';
import { useI18n } from 'vue-i18n';
import useLanguageModal from '@/core/hooks/useLanguageModal';
import FlagUk from '@/core/components/icons/flag-uk.vue';
import FlagFrance from '@/core/components/icons/flag-france.vue';
import FlagVN from '@/core/components/icons/flag-vn.vue';
import FlagRussia from '@/core/components/icons/flag-russia.vue';
import CheckCircleIcon from '@/core/components/icons/check-circle-icon.vue';
import GlobeIcon from '@/core/components/icons/globe-icon.vue';
const { locale } = useI18n();
const { languageVisible, toogleLanguage } = useLanguageModal();

function onLanguageChanged(selectedLanguage: string) {
  i18nService.setLocale(selectedLanguage.toLowerCase());
  locale.value = selectedLanguage.toLowerCase();
}
const languages = [
  {
    name: 'English',
    key: 'us',
    language: 'en',
    icon: FlagUk,
  },
  {
    name: 'Français',
    key: 'fr',
    language: 'fr',
    icon: FlagFrance,
  },
  {
    name: 'Tiếng Việt',
    key: 'vi',
    language: 'vi',
    icon: FlagVN,
  },
  {
    name: 'Pусский',
    key: 'ru',
    language: 'ru',
    icon: FlagRussia,
  },
];
</script>
<template>
  <a-modal v-model:visible="languageVisible" :closable="false" :footer="null" wrap-class-name="ls-language-modal">
    <div class="ls-language-modal">
      <div class="ls-language-modal__title">
        <div class="icon">
          <globe-icon></globe-icon>
        </div>
        <strong class="title">{{ $t('LANGUAGE.SELECT_YOUR_LANGUAGE') }}</strong>
      </div>
      <div class="ls-language-modal__list">
        <div
          v-for="(lang, index) in languages"
          :key="index + 'ls-language-modal__item'"
          class="ls-language-modal__item"
          @click="onLanguageChanged(lang.language)"
        >
          <component :is="lang.icon" />
          <div class="name">{{ lang.name }}</div>
          <div class="mark">
            <check-circle-icon v-if="locale === lang.language" class="icon"></check-circle-icon>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<style lang="less" scoped>
.ls-language-modal {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 28px;
  &__title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      color: #b5bbc2;
      background-color: #b5bbc229;
      border-radius: 16px;
      width: 64px;
      height: 64px;
      padding: 20px;
      margin: 0 auto 12px;
    }
    .title {
      font-size: 20px;
      text-align: center;
      font-weight: 800;
      line-height: 24px;
    }
  }
  &__list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  &__item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 44px;
    padding: 10px 12px;
    cursor: pointer;
    .name {
      font-size: 15px;
      line-height: 20px;
      margin-left: 14px;
      flex-grow: 1;
    }
    .mark {
      width: 24px;
      height: 24px;
    }
    .mark .icon {
      color: #007aff;
    }
  }
  &__item:hover {
    background-color: #f8f9fa;
    border-radius: 8px;
  }
}
</style>
<style lang="less">
.ls-language-modal {
  .ant-modal {
    top: 30%;
    width: 448px;
  }
  .ant-modal-content {
    border-radius: 16px;
    height: 400px;
  }
}
</style>
