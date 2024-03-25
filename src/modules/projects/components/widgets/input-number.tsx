import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, InputNumber, Space } from 'antd';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function InputNumberWidget({
  properties,
  value,
  onChange,
  datastream,
}: TWidgetProps<{ title: string }>) {
  const { t, token } = useApp();

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
        padding: token.padding,
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>
        {properties?.title || t('Input number')}
      </BaseWidgetTitle>

      <Flex justify="space-between">
        <Button
          type="text"
          icon={<MinusOutlined />}
          disabled={
            datastream?.minValue ? value <= datastream?.minValue : false
          }
          onClick={() => {
            setFromButton(true);
            setInputValue(value - 1);
            onChange?.(value - 1);
          }}
        />
        <InputNumber
          value={inputValue}
          onChange={(val) => {
            setFromButton(false);
            setInputValue(val);
          }}
          min={datastream?.minValue}
          max={datastream?.maxValue}
        />
        <Button
          type="text"
          icon={<PlusOutlined />}
          disabled={
            datastream?.maxValue ? value >= datastream?.maxValue : false
          }
          onClick={() => {
            setFromButton(true);
            setInputValue(value + 1);
            onChange?.(value + 1);
          }}
        />
      </Flex>
    </Space>
  );
}

export default InputNumberWidget;
