import { Space, Switch, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { TWidgetProps } from '.';

function SwitchWidget({ title, properties }: TWidgetProps) {
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
      <Typography.Text>{title || t('Switch')}</Typography.Text>

      <Switch checked={properties?.value} />
    </Space>
  );
}

export default SwitchWidget;
