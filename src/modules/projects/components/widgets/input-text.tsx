import { Input, Space } from 'antd';
import { useState } from 'react';
import { useDebounce } from 'react-use';

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
  const [fromButton, setFromButton] = useState(false);

  useDebounce(
    () => {
      if (!fromButton) {
        onChange?.(inputValue);
      }
    },
    1000,
    [inputValue],
  );

  return (
    <Space
      direction="vertical"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>{properties?.title || t('Input text')}</BaseWidgetTitle>

      <Input
        value={inputValue}
        onChange={(e) => {
          setFromButton(false);
          setInputValue(e.target.value);
        }}
      />
    </Space>
  );
}

export default InputTextWidget;
