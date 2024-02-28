import {
  CheckCircleFilled,
  CopyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import {
  Badge,
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dracula as codeHighlightDarkTheme,
  prism as codeHighlightLightTheme,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

import { useAppStore } from '@/modules/app/app.zustand';
import {
  EDeviceHardware,
  EDeviceStatus,
  TDeviceBasic,
} from '@/modules/devices/device.model';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';
import { TST } from '@/shared/types/tst.type';
import { getEsp32TemplateCode } from '@/shared/utils';

export const Route = createFileRoute('/_app/projects/_$projectId/home')({
  component: ProjectIdHome,
});

function ProjectIdHome() {
  const { projectId } = Route.useParams();

  const { t } = useTranslation();

  const gTheme = useAppStore((state) => state.theme);
  const isDark = gTheme.algorithm.includes(theme.darkAlgorithm);

  const { token } = theme.useToken();

  const [selectedDevice, setSelectedDevice] = useState<TDeviceBasic>();

  const { project } = useGetProjectDetail(projectId);

  return (
    <Row gutter={token.sizeLG}>
      <Col span={12}>
        <Space size="large" direction="vertical" style={{ width: '100%' }}>
          <Flex justify="space-between">
            <Typography.Text strong style={{ fontSize: token.fontSizeLG }}>
              {t('deviceWithCount_other', { count: project?.devices.length })}
            </Typography.Text>

            <SoftButton
              token={token}
              type="primary"
              size="small"
              icon={<PlusOutlined />}
            >
              {t('New device')}
            </SoftButton>
          </Flex>

          <Table
            dataSource={project?.devices}
            pagination={false}
            bordered
            columns={[
              {
                dataIndex: 'id',
                key: 'id',
                render: (_id: string, _record, index: number) => index + 1,
              },
              {
                title: t('Device'),
                dataIndex: 'name',
                key: 'name',
                render: (name: string, record) => (
                  <Space direction="vertical" align="center">
                    <Image
                      style={{ borderRadius: token.borderRadius }}
                      width={50}
                      src={
                        record.imageFile?.path ||
                        '/assets/images/device-placeholder.jpeg'
                      }
                    />
                    <Typography.Text strong>{name}</Typography.Text>
                  </Space>
                ),
              },
              {
                title: t('Hardware'),
                dataIndex: 'hardware',
                key: 'hardware',
                render: (hardware: EDeviceHardware) => (
                  <Tag color="blue">{hardware}</Tag>
                ),
              },
              {
                title: t('Status'),
                dataIndex: 'status',
                key: 'status',
                render: (status: EDeviceStatus) => (
                  <Tag
                    color={
                      status == EDeviceStatus.OFFLINE ? 'warning' : 'success'
                    }
                  >
                    {status}
                  </Tag>
                ),
              },
              {
                title: t('Last online'),
                dataIndex: 'lastOnlineAt',
                key: 'lastOnlineAt',
                render: (lastOnlineAt: string) => (
                  <Typography.Text>
                    {lastOnlineAt
                      ? dayjs(lastOnlineAt).format('YYYY-MM-DD HH:mm')
                      : '-'}
                  </Typography.Text>
                ),
              },
              {
                title: t('Auth token'),
                dataIndex: 'authToken',
                key: 'authToken',
                render: (authToken: string) => (
                  <Tag>
                    <Typography.Text
                      copyable
                      ellipsis
                      style={{ maxWidth: 110 }}
                    >
                      {authToken}
                    </Typography.Text>
                  </Tag>
                ),
              },
              {
                title: t('Action'),
                dataIndex: '',
                key: 'action',
                render: (record: TDeviceBasic) => (
                  <Badge
                    count={
                      selectedDevice?.id === record.id ? (
                        <CheckCircleFilled />
                      ) : undefined
                    }
                    size="small"
                    style={{ color: token.colorPrimary }}
                  >
                    <Button
                      size="small"
                      type="dashed"
                      onClick={() => setSelectedDevice(record)}
                    >
                      {t('Select')}
                    </Button>
                  </Badge>
                ),
              },
            ]}
          />
        </Space>
      </Col>

      <Col>
        <Divider type="vertical" style={{ height: '100%' }} />
      </Col>

      <Col>
        <Space direction="vertical">
          <Typography.Text strong style={{ fontSize: token.fontSizeLG }}>
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

          <div style={{ height: token.size }} />

          <CodeContainer token={token}>
            <SyntaxHighlighter
              customStyle={{
                background: 'transparent',
              }}
              language="cpp"
              style={isDark ? codeHighlightDarkTheme : codeHighlightLightTheme}
            >
              {getEsp32TemplateCode(projectId, selectedDevice?.authToken || '')}
            </SyntaxHighlighter>

            <Tooltip title={t('Copy')}>
              <Button
                type="text"
                style={{
                  position: 'absolute',
                  top: token.sizeXXS,
                  right: token.sizeXXS,
                }}
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    getEsp32TemplateCode(
                      projectId,
                      selectedDevice?.authToken || '',
                    ),
                  );
                }}
              />
            </Tooltip>
          </CodeContainer>
        </Space>
      </Col>
    </Row>
  );
}

const CodeContainer = styled.div<TST>`
  background: ${({ token }) => token.colorBgBase};
  position: relative;
  border-radius: ${({ token }) => token.borderRadius}px;
  border: 1px solid ${({ token }) => token.colorBorder};
  overflow: hidden;
`;
