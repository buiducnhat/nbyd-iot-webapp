import { PoweroffOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Col, Flex, Row } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

const Switch3G = ({
  value,
  properties,
  device,
}: TWidgetProps<
  {
    title: string;
    color?: string;
  },
  { state1: 'ON' | 'OFF'; state2: 'ON' | 'OFF'; state3: 'ON' | 'OFF' }
>) => {
  const { t, token } = useApp();

  return (
    <Flex
      vertical
      gap={token.sizeUnit}
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <BaseWidgetTitle>
        {properties?.title || t('ZDevicePinLabel.SWITCH_3G')}
      </BaseWidgetTitle>

      <Row
        css={css`
          height: 100%;
        `}
      >
        {['state1', 'state2', 'state3'].map((state, index) => (
          <Col
            key={index}
            span={8}
            css={css`
              padding: 4px 0;
              display: flex;
              justify-content: center;
              cursor: pointer;
              transition: cubic-bezier();
              :hover {
                background-color: ${properties?.color ||
                device?.color ||
                token.colorPrimary}25;
              }
            `}
          >
            <PoweroffOutlined
              css={css`
                font-size: 32px;
                color: ${value?.[state as 'state1' | 'state2' | 'state3'] ===
                'ON'
                  ? properties?.color || device?.color || token.colorPrimary
                  : token.colorBgMask};
              `}
            />
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Switch3G;
