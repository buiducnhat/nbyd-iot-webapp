import { css } from '@emotion/react';
import { Typography } from 'antd';

import useApp from '@/hooks/use-app';

export const BaseWidgetTitle = ({ children }: { children: string }) => {
  const { token } = useApp();

  return (
    <Typography.Text
      strong
      css={css`
        color: ${token.colorTextLabel};
        font-size: ${token.fontSizeSM}px;
      `}
    >
      {children}
    </Typography.Text>
  );
};
