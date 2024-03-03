import { Space, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { TWidgetProps } from '.';

function ValueBoxWidget({ title, properties }: TWidgetProps) {
  const { t } = useTranslation();

  const { token } = theme.useToken();

  return (
    <Space
      direction="vertical"
      style={{
        padding: token.padding,
        height: '100%',
        width: '100%',
      }}
    >
      <Typography.Text>{title || t('Value box')}</Typography.Text>

      <Typography.Text
        style={{ fontSize: token.fontSizeHeading4, fontFamily: 'monospace' }}
      >
        {properties?.value || '--'}
      </Typography.Text>
    </Space>
  );
}

export default ValueBoxWidget;
