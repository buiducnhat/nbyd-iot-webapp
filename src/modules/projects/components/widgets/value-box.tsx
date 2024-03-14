import { Space, Typography } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function ValueBoxWidget({ properties }: TWidgetProps<any>) {
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
      <BaseWidgetTitle>{properties?.title || t('Value box')}</BaseWidgetTitle>

      <Typography.Text
        style={{ fontSize: token.fontSizeHeading4, fontFamily: 'Chivo Mono' }}
      >
        {properties?.value || '--'}
      </Typography.Text>
    </Space>
  );
}

export default ValueBoxWidget;
