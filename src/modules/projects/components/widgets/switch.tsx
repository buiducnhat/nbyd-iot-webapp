import { Space, Switch, Typography } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import { TWidgetProps } from '@/modules/projects/components/widgets';
import { TST } from '@/shared/types/tst.type';

import { BaseWidgetTitle } from './base-widget-title';

const SSwitch = styled(Switch)<TST & { $color?: string }>`
  &.ant-switch-checked {
    background-color: ${({ $color, $token }) => $color || $token.colorPrimary};
  }

  &.ant-switch-checked:hover:not(.ant-switch-disabled) {
    background-color: ${({ $color, $token }) => $color || $token.colorPrimary};
  }
`;

function SwitchWidget({
  value,
  onChange,
  properties,
  defaultProperties,
  datastream,
}: TWidgetProps<
  {
    title: string;
    color?: string;
    onValue: number;
    offValue: number;
    onTitle?: string;
    offTitle?: string;
  },
  number
>) {
  value = Number(value);

  const { t, token } = useApp();

  const onValue = useMemo(
    () => properties?.onValue || defaultProperties?.onValue || 1,
    [defaultProperties?.onValue, properties?.onValue],
  );
  const offValue = useMemo(
    () => properties?.offValue || defaultProperties?.offValue || 0,
    [defaultProperties?.offValue, properties?.offValue],
  );

  const checked = useMemo(
    () => (value === undefined ? undefined : onValue === value),
    [onValue, value],
  );

  return (
    <Space
      direction="vertical"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>{properties?.title || t('Switch')}</BaseWidgetTitle>

      <Space>
        <SSwitch
          $token={token}
          $color={properties?.color || datastream?.color || token.colorPrimary}
          checked={checked}
          onChange={(checked) => {
            if (checked === undefined) {
              return;
            } else {
              onChange?.(checked ? onValue : offValue);
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
