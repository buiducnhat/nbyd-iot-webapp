import { Flex } from 'antd';
import { useEffect, useRef, useState } from 'react';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

const MIN_SIZE = 40;

function LedWidget({
  value,
  properties,
  datastream,
}: TWidgetProps<{ title: string; color?: string }, string>) {
  value = String(value);

  const { t, token } = useApp();

  const [ledSize, setLedSize] = useState(MIN_SIZE);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setLedSize(
        Math.max(
          Math.min(
            containerRef.current?.offsetHeight || MIN_SIZE,
            containerRef.current?.offsetWidth || MIN_SIZE,
          ),
          MIN_SIZE,
        ) * 0.8,
      );
    });
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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

      <Flex
        ref={containerRef}
        justify="center"
        align="center"
        style={{ flex: 1 }}
      >
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
            width: ledSize,
            height: ledSize,
          }}
        ></div>
      </Flex>
    </Flex>
  );
}

export default LedWidget;
