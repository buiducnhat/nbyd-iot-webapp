import { PoweroffOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Col, Flex, Row } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

const Switch1G = ({
  value,
  onChange,
  properties,
  device,
}: TWidgetProps<
  {
    title: string;
    color?: string;
  },
  { state: 'ON' | 'OFF' }
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
        {properties?.title || t('ZDevicePinLabel.SWITCH_1G')}
      </BaseWidgetTitle>

      <Row
        css={css`
          height: 100%;
        `}
      >
        <Col
          span={24}
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
          onClick={() => {
            onChange?.({
              state: value?.state === 'ON' ? 'OFF' : 'ON',
            });
          }}
        >
          <PoweroffOutlined
            css={css`
              font-size: 36px;
              color: ${value?.state === 'ON'
                ? properties?.color || device?.color || token.colorPrimary
                : token.colorBgMask};
            `}
          />
        </Col>
      </Row>
    </Flex>
  );
};

export default Switch1G;
