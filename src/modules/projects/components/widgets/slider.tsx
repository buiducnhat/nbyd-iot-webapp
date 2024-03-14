import { Col, Row, Slider, Space, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

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
            {value === undefined ? '--' : value}
          </Typography.Text>
        </Col>
      </Row>
    </Space>
  );
}

export default SliderWidget;
