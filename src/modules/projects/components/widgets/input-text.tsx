import { SendOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function InputTextWidget({
  properties,
  value,
  onChange,
}: TWidgetProps<{ title: string }, string>) {
  value = String(value || '');

  const { t } = useApp();

  const [inputValue, setInputValue] = useState(value);

  return (
    <Space
      direction="vertical"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>{properties?.title || t('Input text')}</BaseWidgetTitle>

      <Space.Compact>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <Button
          icon={<SendOutlined />}
          onClick={() => {
            onChange?.(inputValue);
          }}
        />
      </Space.Compact>
    </Space>
  );
}

export default InputTextWidget;
