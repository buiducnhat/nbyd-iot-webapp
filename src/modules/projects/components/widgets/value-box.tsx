import { css } from '@emotion/react';
import { Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { EDeviceDataType } from '@/modules/devices/device.model';
import { isNumberString } from '@/shared/utils';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function ValueBoxWidget({
  value,
  properties,
  defaultProperties,
  device,
}: TWidgetProps<
  { title: string; decimalPlaces?: number; color?: string; unit?: string },
  string
>) {
  const { t, token } = useApp();

  const [localValue, setLocalValue] = useState<string>('--');

  useEffect(() => {
    if (!value) {
      setLocalValue('--');
    } else if (
      device?.dataType === EDeviceDataType.FLOAT &&
      isNumberString(value as string)
    ) {
      setLocalValue(
        parseFloat(value as string).toFixed(
          properties?.decimalPlaces || defaultProperties?.decimalPlaces,
        ),
      );
    } else {
      setLocalValue(value as string);
    }
  }, [
    device?.dataType,
    defaultProperties?.decimalPlaces,
    properties?.decimalPlaces,
    value,
  ]);

  return (
    <Space
      direction="vertical"
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <BaseWidgetTitle>{properties?.title || t('Value box')}</BaseWidgetTitle>

      <Space>
        <Typography.Text
          css={css`
            font-size: ${token.fontSizeHeading4};
            font-family: 'Chivo Mono';
            color: ${properties?.color || token.colorText};
          `}
        >
          {localValue}
        </Typography.Text>

        {properties?.unit || device?.unit ? (
          <Typography.Text type="secondary">
            ({properties?.unit || device?.unit})
          </Typography.Text>
        ) : null}
      </Space>
    </Space>
  );
}

export default ValueBoxWidget;
