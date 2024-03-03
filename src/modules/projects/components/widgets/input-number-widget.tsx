import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, InputNumber, Space, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { TWidgetProps } from '.';

function InputNumberWidget({ title, properties }: TWidgetProps) {
  const { t } = useTranslation();

  const { token } = theme.useToken();

  return (
    <Space
      direction="vertical"
      style={{
        padding: token.padding,
        height: '100%',
        width: '100%',
      }}
    >
      <Typography.Text>{title || t('Input number')}</Typography.Text>

      <Flex justify="space-between">
        <Button type="text" icon={<MinusOutlined />} />
        <InputNumber />
        <Button type="text" icon={<PlusOutlined />} />
      </Flex>
    </Space>
  );
}

export default InputNumberWidget;
