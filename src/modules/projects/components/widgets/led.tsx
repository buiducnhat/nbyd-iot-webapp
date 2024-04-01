import { Flex } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function LedWidget({
  value,
  properties,
  datastream,
}: TWidgetProps<{ title: string; color?: string }, string>) {
  value = String(value);

  const { t, token } = useApp();

  return (
    <Flex
      vertical
      gap={token.paddingXS}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>{properties?.title || t('LED')}</BaseWidgetTitle>

      <Flex justify="center" align="center" style={{ flex: 1 }}>
        <div
          style={{
            backgroundColor:
              value === '0'
                ? token.colorBgLayout
                : properties?.color || datastream?.color || token.colorSuccess,
            borderColor: token.colorBorder,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: '100%',
            width: 32,
            height: 32,
          }}
        ></div>
      </Flex>
    </Flex>
  );
}

export default LedWidget;
