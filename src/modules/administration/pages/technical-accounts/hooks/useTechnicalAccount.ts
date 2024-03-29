import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import {
  getTechnicalAccountsList,
  createTechnicalAccount,
  getTechnicalAccountDetail,
  updateTechnicalAccount,
  deleteTechnicalAccount,
} from '../services/technical-account-api';
import {
  TechnicalAccount,
  TechnicalAccountCreation,
  TechnicalAccountDetails,
  PermissionType,
} from '../types/TechnicalAccount';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES } from '../router';

const list = ref<TechnicalAccount[]>([]);
const filterText = ref('');
const filteredPermissionsText = ref('');
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

const technicalAccountDetails = reactive<TechnicalAccountDetails>({
  uuid: '',
  creationDate: 0,
  modificationDate: 0,
  domain: '',
  domainName: '',
  locked: false,
  enable: false,
  name: '',
  mail: '',
  permissions: [],
  role: '',
});

const changePassword = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const permissionsArray: PermissionType[] = Object.values(PermissionType);

const modal = reactive<{
  type: 'CREATE_TECHNICAL_ACCOUNT' | 'DELETE_TECHNICAL_ACCOUNT';
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
  const router = useRouter();

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
    list.value
      .filter((TechnicalAccountList: TechnicalAccount) =>
        TechnicalAccountList?.name?.toLowerCase().includes(filterText.value.toLowerCase())
      )
      .sort((a: TechnicalAccount, b: TechnicalAccount) => b.modificationDate - a.modificationDate)
  );
  const filteredListByPage = computed(() => {
    const firstIndex = (pagination.current - 1) * pagination.pageSize;
    const lastIndex = pagination.current * pagination.pageSize;
    return filteredList.value.slice(firstIndex, lastIndex);
  });

  const getPermissionTranslation = (permission: string) => {
    return t(`TECHNICAL_ACCOUNTS.DETAIL_PAGE.TECHNICAL_ACCOUNT_PERMISSION_TYPE.${permission}`);
  };

  const filteredPermissions = computed(() => {
    return permissionsArray.filter((permission) => {
      return getPermissionTranslation(permission).toLowerCase().includes(filteredPermissionsText.value.toLowerCase());
    });
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
      fetchTechnicalUserList();
    }
  }

  watch(filteredList, async (newVal) => {
    pagination.total = newVal.length;
    pagination.current =
      pagination.current * pagination.pageSize > pagination.total
        ? Math.ceil(pagination.total / pagination.pageSize) || 1
        : pagination.current;
  });

  const rules = [
    {
      description: 'Contain a symbol',
      validator: (pwd: any) => pwd && /[$-/:-?{-~!"^_`\\µ£#@[\]]/g.test(pwd),
    },
    {
      description: 'Length longer than 12 char',
      validator: (pwd: any) => pwd && pwd.length >= 12,
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

  const strength = ref(0);

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
    } else if (strength.value < 100) {
      return 'password-strength-medium';
    } else {
      return 'password-strength-high';
    }
  });

  function passwordToEvaluate(password: string) {
    calculateStrength(password);
  }

  async function getTechnicalAccountDetailInformation(uuid: string | string[]) {
    try {
      loading.value = true;
      const technicalAccountInformations = await getTechnicalAccountDetail(uuid);
      technicalAccountDetails.uuid = technicalAccountInformations.uuid;
      technicalAccountDetails.creationDate = technicalAccountInformations.creationDate;
      technicalAccountDetails.modificationDate = technicalAccountInformations.modificationDate;
      technicalAccountDetails.domain = technicalAccountInformations.domain;
      technicalAccountDetails.domainName = technicalAccountInformations.domainName;
      technicalAccountDetails.locked = technicalAccountInformations.locked;
      technicalAccountDetails.enable = technicalAccountInformations.enable;
      technicalAccountDetails.name = technicalAccountInformations.name;
      technicalAccountDetails.mail = technicalAccountInformations.mail;
      technicalAccountDetails.permissions = technicalAccountInformations.permissions;
      technicalAccountDetails.role = technicalAccountInformations.role;
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function handleUpdateTechnicalAccount(payload: TechnicalAccountDetails) {
    try {
      loading.value = true;
      await updateTechnicalAccount(payload);
      message.success(t('MESSAGES.UPDATE_SUCCESS'));
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

  fetchTechnicalUserList();

  function onShowDeleteTechnicalAccount() {
    modal.type = 'DELETE_TECHNICAL_ACCOUNT';
    modal.visible = true;
  }

  async function handleDeleteTechnicalAccount(technicalAccountDetails: TechnicalAccount) {
    try {
      loading.value = true;
      await deleteTechnicalAccount(technicalAccountDetails);
      message.success(t('TECHNICAL_ACCOUNTS.DELETE_MODAL.DELETE_SUCCESS'));
      onCloseModal();
      router.push({ name: MY_TECHNICAL_ACCOUNTS_ROUTE_NAMES.TECHNICAL_ACCOUNT_LIST });
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    list,
    loading,
    pagination,
    filterText,
    filteredList,
    filteredListByPage,
    fetchTechnicalUserList,
    handleCreateTechnicalAccount,
    handleUpdateTechnicalAccount,
    modal,
    onCloseModal,
    onCreateTechnicalAccount,
    creationForm,
    strength,
    passwordStrengthClass,
    technicalAccountDetails,
    getTechnicalAccountDetailInformation,
    filteredPermissions,
    filteredPermissionsText,
    onShowDeleteTechnicalAccount,
    handleDeleteTechnicalAccount,
    changePassword,
    passwordToEvaluate,
  };
}
