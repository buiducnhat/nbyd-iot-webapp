import { css } from '@emotion/react';
import { Flex } from 'antd';
import dayjs from 'dayjs';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo } from 'react';

import useApp from '@/hooks/use-app';
import { EDeviceDataType, EDeviceType } from '@/modules/devices/device.model';
import { EZDevicePin } from '@/modules/devices/dto/z-device-pin.enum';

import { FULL_ATTRIBUTES_WIDGETS, TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  CanvasRenderer,
  TitleComponent,
]);

const BasicChartWidget = ({
  properties,
  defaultProperties,
  values,
  device,
  context,
}: TWidgetProps<{ title: string; color?: string; unit?: string }, any>) => {
  const { t, token } = useApp();

  const isIntValue = useMemo(
    () => device?.dataType === EDeviceDataType.INTEGER,
    [device?.dataType],
  );

  const seriesData = useMemo(() => {
    const sortedValues = values?.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    if (device?.type !== EDeviceType.ZIGBEE) {
      return sortedValues?.map((x) => x.value);
    } else {
      switch (device?.pin) {
        case EZDevicePin.DOOR_SENSOR:
          return sortedValues?.map((x) => (x.value.contact ? 1 : 0));
        case EZDevicePin.TH_SENSOR:
          return sortedValues?.map((x) => x.value.temperature);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device?.pin, device?.type, values, JSON.stringify(values)]);

  return (
    <Flex
      vertical
      gap={token.size}
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <BaseWidgetTitle>{properties?.title || t('Basic chart')}</BaseWidgetTitle>

      {context !== 'dashboard' ? (
        <img
          src={FULL_ATTRIBUTES_WIDGETS.BASIC_CHART.placeholderImageUrl}
          css={css`
            object-fit: contain;
            max-height: 200px;
          `}
          alt={device?.name}
        />
      ) : (
        <ReactEChartsCore
          echarts={echarts}
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
          }}
          option={
            {
              tooltip: {
                trigger: 'axis',
              },
              xAxis: {
                type: 'category',
                name: 'Time',
                data:
                  values?.map((x) =>
                    dayjs(x.createdAt).format('YYYY/MM/DD HH:mm:ss'),
                  ) || [],
                axisLabel: {
                  formatter: (value) => dayjs(value).format('HH:mm:ss'),
                },
              },
              yAxis: {
                type: 'value',
                name: 'Value',
                minInterval: isIntValue ? 1 : undefined,
              },
              series: [
                {
                  type: 'line',
                  data: seriesData || [],
                  color:
                    properties?.color ||
                    defaultProperties?.color ||
                    device?.color,
                },
              ],
            } as EChartsOption
          }
          notMerge
          lazyUpdate
          theme="light"
        />
      )}
    </Flex>
  );
};

export default BasicChartWidget;
