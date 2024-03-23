import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Flex,
  Image,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import modal from 'antd/es/modal';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dracula as codeHighlightDarkTheme,
  prism as codeHighlightLightTheme,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import DeviceFormDrawer from '@/modules/devices/components/device-form-drawer';
import {
  EDeviceHardware,
  EDeviceStatus,
  TDevice,
} from '@/modules/devices/device.model';
import deviceService from '@/modules/devices/device.service';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';
import { TST } from '@/shared/types/tst.type';
import { getEsp32TemplateCode } from '@/shared/utils';

export const Route = createFileRoute('/_app/projects/_$projectId/home')({
  component: ProjectIdHome,
});

function ProjectIdHome() {
  const { projectId } = Route.useParams();

  const { t, token, isDarkTheme, antdApp } = useApp();

  const [deviceFormAction, setDeviceFormAction] = useState<'create' | 'update'>(
    'create',
  );
  const [selectedDevice, setSelectedDevice] = useState<TDevice>();
  const [openDeviceFormDrawer, setOpenDeviceFormDrawer] = useState(false);

  const { project, projectQuery } = useGetProjectDetail(projectId);

  const deleteDeviceMutation = useMutation({
    mutationFn: (deviceId: string) => deviceService.delete(projectId, deviceId),
    onSuccess: () => {
      projectQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

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
                $token={token}
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
              rowKey={(record) => record.id}
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
                  fixed: 'left',
                  render: (name: string, record) => (
                    <Space direction="vertical" align="center">
                      <Image
                        style={{ borderRadius: token.borderRadius }}
                        width={50}
                        src={
                          record.imageFileUrl ||
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
                  title: t('Actions'),
                  dataIndex: '',
                  key: 'action',
                  fixed: 'right',
                  render: (_, record) => (
                    <Dropdown
                      trigger={['click']}
                      menu={{
                        items: [
                          {
                            label: t('View'),
                            key: 'view',
                            icon: <EyeOutlined />,
                            onClick: () => {
                              setSelectedDevice(record);
                              // setOpenPreviewDrawer(true);
                            },
                          },
                          {
                            label: t('Edit'),
                            key: 'edit',
                            icon: <EditOutlined />,
                            onClick: () => {
                              setDeviceFormAction('update');
                              setSelectedDevice(record);
                              setOpenDeviceFormDrawer(true);
                            },
                          },
                          {
                            label: t('Delete'),
                            key: 'delete',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => {
                              modal.confirm({
                                title: t('Delete confirmation'),
                                content: t(
                                  'Are you sure you want to delete this item?',
                                ),
                                okText: t('Yes'),
                                cancelText: t('No'),
                                onOk: async () => {
                                  await deleteDeviceMutation.mutateAsync(
                                    record.id,
                                  );
                                },
                              });
                            },
                          },
                        ],
                      }}
                    >
                      <Button>
                        <Space>
                          <MoreOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                  ),
                },
              ]}
            />
          </Space>
        </Col>

        <Col
          span={1}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Divider type="vertical" style={{ height: '100%' }} />
        </Col>

        <Col span={11}>
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

            <CodeContainer $token={token}>
              <SyntaxHighlighter
                customStyle={{
                  background: 'transparent',
                }}
                language="cpp"
                style={
                  isDarkTheme ? codeHighlightDarkTheme : codeHighlightLightTheme
                }
              >
                {getEsp32TemplateCode(projectId)}
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
                        selectedDevice?.authToken,
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
  background: ${({ $token }) => $token.colorBgBase};
  position: relative;
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px solid ${({ $token }) => $token.colorBorder};
  overflow: hidden;
`;
