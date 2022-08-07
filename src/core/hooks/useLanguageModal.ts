import { ref, Ref } from 'vue';

type UsableLanguageModal = {
  languageVisible: Ref<boolean>;
  toogleLanguage: (state: boolean) => void;
};
const languageVisible = ref<boolean>(false);

export default function useLanguageModal(): UsableLanguageModal {
  const toogleLanguage = (state: boolean) => {
    languageVisible.value = state;
  };

  return {
    languageVisible,
    toogleLanguage,
  };
}
