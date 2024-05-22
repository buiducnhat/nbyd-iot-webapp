import { PoweroffOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Col, Flex, Row } from 'antd';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

const Switch2G = ({
  value,
  properties,
  device,
  onChange,
}: TWidgetProps<
  {
    title: string;
    color?: string;
  },
  { state_l1?: 'ON' | 'OFF'; state_l2?: 'ON' | 'OFF' }
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
        {properties?.title || t('ZDevicePinLabel.SWITCH_2G')}
      </BaseWidgetTitle>

      <Row
        css={css`
          height: 100%;
        `}
        gutter={[token.sizeXS, token.sizeXS]}
      >
        {['state_l1', 'state_l2'].map((state: string, index) => (
          <Col key={index} span={12}>
            <div
              css={css`
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                cursor: pointer;
                transition: cubic-bezier();
                background-color: ${(value as any)?.[state] === 'ON'
                  ? `${
                      properties?.color || device?.color || token.colorPrimary
                    }25`
                  : `${token.colorBorder}50`};
                :hover {
                  background-color: ${properties?.color ||
                  device?.color ||
                  token.colorPrimary}50;
                }
              `}
              onClick={() => {
                if (!value) {
                  onChange?.({
                    [state]: 'ON',
                  });
                } else {
                  onChange?.({
                    ...value,
                    [state]: (value as any)?.[state] === 'ON' ? 'OFF' : 'ON',
                  });
                }
              }}
            >
              <PoweroffOutlined
                css={css`
                  font-size: 32px;
                  color: ${(value as any)?.[state] === 'ON'
                    ? properties?.color || device?.color || token.colorPrimary
                    : token.colorBgMask};
                `}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Switch2G;
