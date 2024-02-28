import { Alert, Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

type ConfirmActionModalProps = {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
};

const ConfirmActionModal = (props: ConfirmActionModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('Confirmation')}
      open={props.isModalVisible}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      footer={[
        <Button key="back" onClick={props.handleCancel}>
          {t('Cancel')}
        </Button>,
        <Button key="submit" type="primary" onClick={props.handleOk}>
          {t('OK')}
        </Button>,
      ]}
    >
      <Alert message={t('Are you sure?')} type="warning" showIcon />
    </Modal>
  );
};

export default ConfirmActionModal;
