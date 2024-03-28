import { Col, Row, Slider, Space, Typography } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function SliderWidget({
  value,
  onChange,
  properties,
  datastream,
}: TWidgetProps<
  {
    title: string;
    step: number;
    min: number;
    max: number;
  },
  number
>) {
  const { t, token } = useApp();

  value = Number(value);

  return (
    <Space
      direction="vertical"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <BaseWidgetTitle>{properties?.title || t('Slider')}</BaseWidgetTitle>

      <Row gutter={token.sizeXS}>
        <Col span={18}>
          <Slider
            value={value}
            onChange={onChange}
            step={properties?.step}
            min={datastream?.minValue}
            max={datastream?.maxValue}
          />
        </Col>

        <Col span={6} style={{ textAlign: 'end' }}>
          <Typography.Text
            style={{
              fontSize: token.fontSizeHeading4,
              fontFamily: 'Chivo Mono',
            }}
          >
            {!value ? '--' : value}
          </Typography.Text>
        </Col>
      </Row>
    </Space>
  );
}

export default SliderWidget;
