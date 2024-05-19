import { css } from '@emotion/react';
import { Flex } from 'antd';
import { FaDoorClosed, FaDoorOpen } from 'react-icons/fa';

import useApp from '@/hooks/use-app';

import { TWidgetProps } from '.';
import { BaseWidgetTitle } from './base-widget-title';

const DoorContact = ({
  value,
  properties,
  device,
}: TWidgetProps<
  {
    title: string;
    color?: string;
  },
  { contact: boolean }
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
        {properties?.title || t('ZDevicePinLabel.DOOR_SENSOR')}
      </BaseWidgetTitle>

      <Flex
        justify="center"
        align="center"
        css={css`
          height: 100%;
        `}
      >
        {value?.contact ? (
          <FaDoorClosed
            css={css`
              font-size: 36px;
            `}
            color={token.colorBgMask}
          />
        ) : (
          <FaDoorOpen
            css={css`
              font-size: 36px;
            `}
            color={properties?.color || device?.color || token.colorPrimary}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default DoorContact;
