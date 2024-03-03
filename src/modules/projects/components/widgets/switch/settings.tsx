import { Col, Form, Input, Row, Select, theme } from 'antd';
import { useTranslation } from 'react-i18next';

function SliderSettingsModal() {
  const { t } = useTranslation();

  const { token } = theme.useToken();

  return (
    <Row style={{ marginTop: token.marginXL }} gutter={token.size}>
      <Col span={12}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          // style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item label={t('Title')}>
            <Input />
          </Form.Item>

          <Form.Item label={t('Datastream')}>
            <Select></Select>
          </Form.Item>
        </Form>
      </Col>

      <Col span={12}>Preview</Col>
    </Row>
  );
}

export default SliderSettingsModal;
