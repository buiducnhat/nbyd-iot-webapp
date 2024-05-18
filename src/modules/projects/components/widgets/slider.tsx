import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Col, Flex, Row, Typography } from 'antd';
import Slider from 'rc-slider';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TAntdToken } from '@/shared/types/tst.type';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

const SSlider = styled(Slider)<TAntdToken & { $color: string }>`
  margin-left: 7px;

  & .rc-slider-track {
    background-color: ${({ $color }) => $color};
  }

  & .rc-slider-handle {
    border-color: ${({ $color }) => $color};
  }

  & .rc-slider-handle:active {
    border-color: ${({ $color }) => $color};
    box-shadow: 0 0 5px ${({ $color }) => $color};
  }
`;

function SliderWidget({
  value,
  onChange,
  properties,
  defaultProperties,
  device,
}: TWidgetProps<
  {
    title: string;
    color?: string;
    step: number;
    min: number;
    max: number;
  },
  number
>) {
  const { t, token } = useApp();

  const [localValue, setLocalValue] = useState(Number(value));

  useEffect(() => {
    setLocalValue(Number(value));
  }, [value]);

  return (
    <Flex
      vertical
      gap={token.sizeUnit}
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <BaseWidgetTitle>{properties?.title || t('Slider')}</BaseWidgetTitle>

      <Row
        gutter={token.sizeXS}
        css={css`
          flex: 1;
        `}
      >
        <Col
          span={18}
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <SSlider
            $token={token}
            $color={properties?.color || device?.color || token.colorPrimary}
            value={localValue}
            onChange={(val) => {
              if (typeof val === 'number' && !isNaN(val)) {
                setLocalValue(val);
              }
            }}
            onChangeComplete={(val) => {
              if (typeof val === 'number' && !isNaN(val)) {
                onChange?.(val as number);
              }
            }}
            step={properties?.step || defaultProperties?.step}
            min={device?.minValue || properties?.min || defaultProperties?.min}
            max={device?.maxValue || properties?.max || defaultProperties?.max}
          />
        </Col>

        <Col
          span={6}
          css={css`
            display: flex;
            align-items: center;
            justify-content: end;
          `}
        >
          <Typography.Text
            css={css`
              font-size: ${token.fontSizeHeading4};
              font-family: 'Chivo Mono';
            `}
          >
            {isNaN(localValue) ? '--' : localValue}
          </Typography.Text>
        </Col>
      </Row>
    </Flex>
  );
}

export default SliderWidget;
