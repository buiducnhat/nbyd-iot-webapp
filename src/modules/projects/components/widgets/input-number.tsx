import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, InputNumber, Space } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function InputNumberWidget({ properties }: TWidgetProps<any>) {
  const { t, token } = useApp();

  return (
    <Space
      direction="vertical"
      style={{
        padding: token.padding,
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>
        {properties?.title || t('Input number')}
      </BaseWidgetTitle>

      <Flex justify="space-between">
        <Button type="text" icon={<MinusOutlined />} />
        <InputNumber />
        <Button type="text" icon={<PlusOutlined />} />
      </Flex>
    </Space>
  );
}

export default InputNumberWidget;
