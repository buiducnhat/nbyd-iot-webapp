import { Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { EDatastreamDataType } from '@/modules/datastreams/datastream.model';
import { isDefined, isNumberString } from '@/shared/utils';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function ValueBoxWidget({
  value,
  properties,
  defaultProperties,
  datastream,
}: TWidgetProps<{ title: string; decimalPlaces?: number }, string>) {
  const { t, token } = useApp();

  const [localValue, setLocalValue] = useState<string>('--');

  useEffect(() => {
    if (!isDefined(value)) {
      setLocalValue('--');
    } else if (
      datastream?.dataType === EDatastreamDataType.FLOAT &&
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
    datastream?.dataType,
    defaultProperties?.decimalPlaces,
    properties?.decimalPlaces,
    value,
  ]);

  return (
    <Space
      direction="vertical"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>{properties?.title || t('Value box')}</BaseWidgetTitle>

      <Space>
        <Typography.Text
          style={{ fontSize: token.fontSizeHeading4, fontFamily: 'Chivo Mono' }}
        >
          {localValue}
        </Typography.Text>

        {datastream?.unit ? (
          <Typography.Text type="secondary">
            ({datastream.unit})
          </Typography.Text>
        ) : null}
      </Space>
    </Space>
  );
}

export default ValueBoxWidget;
