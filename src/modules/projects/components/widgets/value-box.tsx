import { Space, Typography } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function ValueBoxWidget({
  value,
  properties,
  datastream,
}: TWidgetProps<{ title: string }, string>) {
  value = String(value || '--');

  const { t, token } = useApp();

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
          {value !== undefined ? value : '--'}
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
