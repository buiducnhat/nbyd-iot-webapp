import { CopyOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Drawer, Flex, Space, Tooltip, Typography } from 'antd';
import { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dracula as codeHighlightDarkTheme,
  prism as codeHighlightLightTheme,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import useApp from '@/hooks/use-app';
import { TAntdToken } from '@/shared/types/tst.type';
import { getEsp32TemplateCode } from '@/shared/utils';

import { EGatewayHardware, TGateway } from '../gateway.model';

type TGatewayCodeDrawerProps = {
  projectId: string;
  gateway: TGateway;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const GatewayCodeDrawer = ({
  projectId,
  gateway,
  open,
  setOpen,
}: TGatewayCodeDrawerProps) => {
  const { t, isDarkTheme, token } = useApp();

  const code = useMemo(() => {
    return gateway.hardware === EGatewayHardware.ESP32
      ? getEsp32TemplateCode(projectId, gateway?.authToken)
      : '';
  }, [gateway, projectId]);

  return (
    <Drawer
      title={t('Gateway')}
      width={600}
      open={open}
      onClose={() => setOpen(false)}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>
        </Space>
      }
    >
      <Space direction="vertical">
        <Typography.Text
          strong
          css={css`
            font-size: ${token.fontSizeLG}px;
          `}
        >
          {t('Instructions')}
        </Typography.Text>

        <Flex vertical>
          <Typography.Text type="secondary">
            {t('template_code_instruction_1')}.
          </Typography.Text>
          <Typography.Text type="secondary">
            {t('template_code_instruction_2')}.
          </Typography.Text>
        </Flex>
      </Space>

      <CodeContainer $token={token}>
        <SyntaxHighlighter
          customStyle={{
            background: 'transparent',
          }}
          language="cpp"
          style={isDarkTheme ? codeHighlightDarkTheme : codeHighlightLightTheme}
        >
          {code}
        </SyntaxHighlighter>

        <Tooltip title={t('Copy')}>
          <Button
            type="text"
            css={css`
              position: absolute;
              top: ${token.sizeXXS}px;
              right: ${token.sizeXXS}px;
            `}
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(code);
            }}
          />
        </Tooltip>
      </CodeContainer>
    </Drawer>
  );
};

export default GatewayCodeDrawer;

const CodeContainer = styled.div<TAntdToken>`
  background: ${({ $token }) => $token.colorBgBase};
  position: relative;
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px solid ${({ $token }) => $token.colorBorder};
  overflow: hidden;
`;
