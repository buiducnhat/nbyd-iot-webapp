import { Space, Switch, Typography } from 'antd';
import { useMemo } from 'react';

import useApp from '@/hooks/use-app';
import { TWidgetProps } from '@/modules/projects/components/widgets';

import { BaseWidgetTitle } from './base-widget-title';

function SwitchWidget({
  value,
  onChange,
  properties = { title: '', onValue: 1, offValue: 0 },
}: TWidgetProps<
  {
    title: string;
    onValue: number;
    offValue: number;
    onTitle?: string;
    offTitle?: string;
  },
  number
>) {
  const { t, token } = useApp();

  const checked = useMemo(
    () => (value === undefined ? undefined : properties.onValue === value),
    [properties.onValue, value],
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
      <BaseWidgetTitle>{properties?.title || t('Switch')}</BaseWidgetTitle>

      <Space>
        <Switch
          checked={checked}
          onChange={(checked) => {
            if (checked === undefined) {
              return;
            } else {
              onChange?.(checked ? properties.onValue : properties.offValue);
            }
          }}
        />

        {properties?.onTitle && properties?.offTitle && (
          <Typography.Text code>
            {checked ? properties?.onTitle : properties?.offTitle}
          </Typography.Text>
        )}
      </Space>
    </Space>
  );
}

export default SwitchWidget;
