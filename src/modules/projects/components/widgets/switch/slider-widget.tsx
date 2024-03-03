import { Col, Row, Slider, Space, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { TWidgetProps } from '..';

function SlierWidget({ title, properties }: TWidgetProps) {
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
      <Typography.Text>{title || t('Slider')}</Typography.Text>

      <Row gutter={token.sizeXS}>
        <Col span={18}>
          <Slider />
        </Col>

        <Col span={6} style={{ textAlign: 'end' }}>
          <Typography.Text
            style={{
              fontSize: token.fontSizeHeading4,
              fontFamily: 'monospace',
            }}
          >
            {properties?.value || '--'}
          </Typography.Text>
        </Col>
      </Row>
    </Space>
  );
}

export default SlierWidget;
