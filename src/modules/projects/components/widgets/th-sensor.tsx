import { css } from '@emotion/react';
import { Flex, Typography } from 'antd';
import { FaThermometerHalf, FaTint } from 'react-icons/fa';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

function THSensorWidget({
  value,
  properties,
}: TWidgetProps<{ title: string }, { temperature: number; humidity: number }>) {
  const { t, token } = useApp();

  return (
    <Flex
      gap={token.sizeUnit}
      vertical
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <BaseWidgetTitle>{properties?.title || t('Temp-Humi')}</BaseWidgetTitle>

      <Flex
        justify="space-between"
        align="center"
        css={css`
          flex: 1;
        `}
      >
        <Flex
          vertical
          align="center"
          css={css`
            width: 100%;
          `}
        >
          <FaThermometerHalf
            css={css`
              color: ${token.red};
            `}
          />

          <Typography.Text
            css={css`
              font-size: ${token.fontSizeHeading4};
              font-family: 'Chivo Mono';
              color: ${token.red};
            `}
          >
            {value?.temperature || '--'}{' '}
            <span
              css={css`
                color: ${token.colorText};
              `}
            >
              °C
            </span>
          </Typography.Text>
        </Flex>

        <Flex
          vertical
          align="center"
          css={css`
            width: 100%;
          `}
        >
          <FaTint
            css={css`
              color: ${token.blue};
            `}
          />

          <Typography.Text
            css={css`
              font-size: ${token.fontSizeHeading4};
              font-family: 'Chivo Mono';
              color: ${token.blue};
            `}
          >
            {value?.humidity || '--'}{' '}
            <span
              css={css`
                color: ${token.colorText};
              `}
            >
              %
            </span>
          </Typography.Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default THSensorWidget;
