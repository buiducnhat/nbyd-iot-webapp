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
}: TWidgetProps<{ title: string }, number>) {
  value = Number(value);

  const { t } = useApp();

  const [inputValue, setInputValue] = useState(value);
  const [fromButton, setFromButton] = useState(false);

  useDebounce(
    () => {
      if (!fromButton && inputValue !== value) {
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
      <BaseWidgetTitle>
        {properties?.title || t('Input number')}
      </BaseWidgetTitle>

      <Flex justify="space-between">
        <Button
          type="text"
          icon={<MinusOutlined />}
          disabled={
            typeof value === 'number' && datastream?.minValue
              ? value <= datastream?.minValue
              : false
          }
          onClick={() => {
            setFromButton(true);
            setInputValue(typeof value === 'number' ? value - 1 : 0);
            onChange?.(typeof value === 'number' ? value - 1 : 0);
          }}
        />
        <InputNumber
          value={inputValue}
          onChange={(val) => {
            setFromButton(false);
            setInputValue(typeof val === 'number' ? val : 0);
          }}
          min={datastream?.minValue}
          max={datastream?.maxValue}
        />
        <Button
          type="text"
          icon={<PlusOutlined />}
          disabled={
            typeof value === 'number' && datastream?.maxValue
              ? value >= datastream?.maxValue
              : false
          }
          onClick={() => {
            setFromButton(true);
            setInputValue(typeof value === 'number' ? value + 1 : 0);
            onChange?.(typeof value === 'number' ? value + 1 : 0);
          }}
        />
      </Flex>
    </Space>
  );
}

export default InputNumberWidget;
