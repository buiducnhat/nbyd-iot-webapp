import { Typography } from 'antd';

import useApp from '@/hooks/use-app';

export const BaseWidgetTitle = ({ children }: { children: string }) => {
  const { token } = useApp();

  return (
    <Typography.Text strong style={{ color: token.colorTextLabel }}>
      {children}
    </Typography.Text>
  );
};
