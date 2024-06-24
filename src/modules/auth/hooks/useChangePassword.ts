import { reactive, ref, computed, watch } from 'vue';
import { DEFAULT_PAGE_SIZE } from '@/core/constants';
import { message } from 'ant-design-vue';
import { APIError } from '@/core/types/APIError';
import { changePassword } from '../services/auth-api';
import { ChangePassword } from '../types/ChangePassword';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const loading = ref(false);

const creationForm = reactive({
  old_password: '',
  new_password: '',
  password_confirmation: '',
});

const changePasswordPayload = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

export default function useChangePassword() {
  const { t } = useI18n();
  const router = useRouter();

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

  async function handleChangePassword(payload: ChangePassword) {
    try {
      loading.value = true;
      const data = await changePassword(payload);
      message.success(t('EMAIL_TEMPLATES.CREATE_MODAL.CREATE_SUCCESS'));
    } catch (error) {
      if (error instanceof APIError) {
        message.error(error.getMessage());
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    creationForm,
    strength,
    passwordStrengthClass,
    changePasswordPayload,
    handleChangePassword,
    passwordToEvaluate,
  };
}
