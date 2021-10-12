import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

interface ModalOptions {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  onOk?: (...args: any[]) => any;
}

export default function useNotification () {
  const { t } = useI18n();

  const infoModal = (options: ModalOptions) => Modal.info({
    title: () => options.title,
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => options.content,
    okText: () => options.okText || t('GENERAL.OK'),
    onOk: options.onOk
  });

  const confirmModal = (options: ModalOptions) => Modal.confirm({
    title: () => options.title,
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => options.content,
    okText: () => options.okText || t('GENERAL.OK'),
    cancelText: () => options.cancelText || t('GENERAL.CANCEL'),
    onOk: options.onOk
  });

  return {
    infoModal,
    confirmModal
  };
}
