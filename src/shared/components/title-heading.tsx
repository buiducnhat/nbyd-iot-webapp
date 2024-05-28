import { css } from '@emotion/react';
import { Typography } from 'antd';

import useApp from '@/hooks/use-app';
import useDeviceSize from '@/hooks/use-device-size';

const TitleHeading = ({ children }: { children: string }) => {
  const { token } = useApp();

  const { isMobile } = useDeviceSize();

  return (
    <Typography.Text
      strong
      css={css`
        font-size: ${isMobile
          ? token.fontSizeHeading4
          : token.fontSizeHeading3}px;
      `}
    >
      {children}
    </Typography.Text>
  );
};

export default TitleHeading;
