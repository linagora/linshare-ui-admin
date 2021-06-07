<template>
  <div class='language-selector'>
    <a-select
      dropdownClassName="language-selector-dropdown-container"
      v-model:value="selectedLanguage"
      @select="onLanguageChanged"
    >
      <a-select-option v-for="language in supportedLanguages" :key="language.key" :value="language.language">
        <div class="select-dropdown">
          <span class="select-dropdown__symbol">{{ language.name }}</span>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue';
import i18nService from '@/core/services/I18nService';
import { useI18n } from 'vue-i18n';
import { LANGUAGES } from '@/core/constants';

export default {
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

};
</script>

<style lang="less">
.language-selector {
  .ant-select.ant-select-single.ant-select-show-arrow {
    &.ant-select-focused {
      .ant-select-selector {
        background: #0372B3;
        box-shadow: none !important;
      }
    }

    .ant-select-selector {
      border: 0px;
      background: #0372B3;
      color: #fff;

      .ant-select-selection-item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: #333;
      }

      .select-dropdown__symbol {
        color: #fff;
      }
    }

    .ant-select-arrow {
      color: #fff;
    }
  }
}
</style>

<style lang='less' scoped>
.language-selector {
  float: right;

  .select-dropdown {
    display: flex;
    align-items: center;

    .select-dropdown__icon {
      margin-right: 4px;
    }

    .select-dropdown__symbol {
      line-height: 0.1;
    }
  }
}
</style>
