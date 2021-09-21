<template>
  <div class="language-selector">
    <a-select
      v-model:value="selectedLanguage"
      @select="onLanguageChanged"
    >
      <a-select-option
        v-for="language in supportedLanguages"
        :key="language.key"
        :value="language.language"
      >
        <div class="select-dropdown">
          <span class="select-dropdown__symbol">{{ language.name }}</span>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent } from 'vue';
import i18nService from '@/core/services/I18nService';
import { useI18n } from 'vue-i18n';
import { LANGUAGES } from '@/core/constants';

export default defineComponent({
  name: 'LanguageSelector',
  setup () {
    const { locale } = useI18n();
    const selectedLanguage = ref(i18nService.getLocale());

    function onLanguageChanged (selectedLanguage: string) {
      i18nService.setLocale(selectedLanguage.toLowerCase());
      locale.value = selectedLanguage.toLowerCase();
    }

    return {
      supportedLanguages: LANGUAGES.SUPPORTED_LANGUAGE,
      selectedLanguage,
      onLanguageChanged
    };
  }
});
</script>

<style lang="less">
  .language-selector {
    .ant-select.ant-select-single.ant-select-show-arrow {
      .ant-select-selector {
        border: 0px;
        background: @menu-bg;
        color: @menu-item-color;

        .ant-select-selection-item {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: 400;
        }
      }

      .ant-select-arrow {
        color: @menu-item-color;
      }
    }
  }
</style>
