import {
  CheckCircleFilled,
  CopyOutlined,
  EditOutlined,
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
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dracula as codeHighlightDarkTheme,
  prism as codeHighlightLightTheme,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import DeviceFormDrawer from '@/modules/devices/device-form-drawer';
import {
  EDeviceHardware,
  EDeviceStatus,
  TDevice,
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

  const { t, token, isDarkTheme } = useApp();

  const [deviceFormAction, setDeviceFormAction] = useState<'create' | 'update'>(
    'create',
  );
  const [selectedDevice, setSelectedDevice] = useState<TDevice>();
  const [openDeviceFormDrawer, setOpenDeviceFormDrawer] = useState(false);

  const { project, projectQuery } = useGetProjectDetail(projectId);

  return (
    <>
      <DeviceFormDrawer
        action={deviceFormAction}
        open={openDeviceFormDrawer}
        setOpen={setOpenDeviceFormDrawer}
        projectId={projectId}
        device={selectedDevice}
        refetch={() => projectQuery.refetch()}
      />

      <Row gutter={token.sizeLG}>
        <Col span={12}>
          <Space size="large" direction="vertical" style={{ width: '100%' }}>
            <Flex justify="space-between">
              <Typography.Text strong style={{ fontSize: token.fontSizeLG }}>
                {t('deviceWithCount', { count: project?.devices.length })}
              </Typography.Text>

              <SoftButton
                token={token}
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setDeviceFormAction('create');
                  setOpenDeviceFormDrawer(true);
                }}
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
                  render: (record: TDevice) => (
                    <Space>
                      <Tooltip title={t('Edit')}>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setDeviceFormAction('update');
                            setSelectedDevice(record);
                            setOpenDeviceFormDrawer(true);
                          }}
                        />
                      </Tooltip>
                    </Space>
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
                style={
                  isDarkTheme ? codeHighlightDarkTheme : codeHighlightLightTheme
                }
              >
                {getEsp32TemplateCode(
                  projectId,
                  selectedDevice?.authToken || '',
                )}
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
    </>
  );
}

const CodeContainer = styled.div<TST>`
  background: ${({ token }) => token.colorBgBase};
  position: relative;
  border-radius: ${({ token }) => token.borderRadius}px;
  border: 1px solid ${({ token }) => token.colorBorder};
  overflow: hidden;
`;
