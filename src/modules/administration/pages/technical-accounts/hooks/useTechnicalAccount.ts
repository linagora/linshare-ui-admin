import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { getTechnicalAccountsList, createTechnicalAccount } from '../services/technical-account-api';
import { TechnicalAccount, TechnicalAccountCreation } from '../types/TechnicalAccount';
import { useI18n } from 'vue-i18n';

const list = ref<TechnicalAccount[]>([]);
const filterText = ref('');
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
});
const loading = ref(false);

const creationForm = reactive({
  enable: false,
  mail: '',
  name: '',
  password: '',
  password_confirmation: '',
  role: '',
});

const modal = reactive<{
  type: 'CREATE_TECHNICAL_ACCOUNT';
  visible: boolean;
}>({
  type: 'CREATE_TECHNICAL_ACCOUNT',
  visible: false,
});

function onCloseModal() {
  modal.visible = false;
}

export default function useTechnicalAccount() {
  const { t } = useI18n();

  async function fetchTechnicalUserList() {
    loading.value = true;
    try {
      const accounts = await getTechnicalAccountsList();
      list.value = accounts;
      loading.value = false;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    }
  }

  const filteredList = computed(() =>
    list.value.filter((TechnicalAccountList: TechnicalAccount) =>
      TechnicalAccountList?.name?.toLowerCase().includes(filterText.value.toLowerCase())
    )
  );
  const filteredListByPage = computed(() => {
    const firstIndex = (pagination.current - 1) * pagination.pageSize;
    const lastIndex = pagination.current * pagination.pageSize;
    return filteredList.value.slice(firstIndex, lastIndex);
  });

  function onCreateTechnicalAccount() {
    modal.type = 'CREATE_TECHNICAL_ACCOUNT';
    modal.visible = true;
  }

  async function handleCreateTechnicalAccount(payload: TechnicalAccountCreation) {
    try {
      loading.value = true;
      await createTechnicalAccount(payload);
      message.success(t('EMAIL_TEMPLATES.CREATE_MODAL.CREATE_SUCCESS'));
      return true;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
  });

  const rules = [
    {
      description: 'Contain a symbol',
      validator: (pwd: any) => pwd && /[$-/:-?{-~!"^_`[\]]/g.test(pwd),
    },
    {
      description: 'Length longer than 8 char',
      validator: (pwd: any) => pwd && pwd.length >= 8,
    },
    {
      description: 'Contain a digit',
      validator: (pwd: any) => pwd && /[0-9]+/.test(pwd),
    },
    {
      description: 'Contain an upper case character',
      validator: (pwd: any) => pwd && /[A-Z]+/.test(pwd),
    },
    {
      description: 'Contain a lower case character',
      validator: (pwd: any) => pwd && /[a-z]+/.test(pwd),
    },
  ];

  // Create a ref for the password and strength
  const strength = ref(0);

  // Create a function to calculate the strength score
  const calculateStrength = (password: string) => {
    let score = 0;
    rules.forEach((rule) => {
      if (rule.validator(password)) {
        score += 1;
      }
    });
    strength.value = (score / rules.length) * 100;
  };

  const passwordStrengthClass = computed(() => {
    if (strength.value === 0) {
      return '';
    } else if (strength.value < 50) {
      return 'password-strength-low';
    } else if (strength.value < 80) {
      return 'password-strength-medium';
    } else {
      return 'password-strength-high';
    }
  });

  watch(
    () => creationForm.password,
    (newPassword) => {
      calculateStrength(newPassword);
    }
  );

  fetchTechnicalUserList();

  return {
    list,
    loading,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    fetchTechnicalUserList,
    handleCreateTechnicalAccount,
    modal,
    onCloseModal,
    onCreateTechnicalAccount,
    creationForm,
    strength,
    passwordStrengthClass,
  };
}
