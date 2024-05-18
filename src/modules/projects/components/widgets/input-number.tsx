import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
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
  device,
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
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <BaseWidgetTitle>
        {properties?.title || t('Input number')}
      </BaseWidgetTitle>

      <Flex justify="space-between">
        <Button
          type="text"
          icon={<MinusOutlined />}
          disabled={
            typeof value === 'number' && device?.minValue
              ? value <= device?.minValue
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
          min={device?.minValue}
          max={device?.maxValue}
        />
        <Button
          type="text"
          icon={<PlusOutlined />}
          disabled={
            typeof value === 'number' && device?.maxValue
              ? value >= device?.maxValue
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
