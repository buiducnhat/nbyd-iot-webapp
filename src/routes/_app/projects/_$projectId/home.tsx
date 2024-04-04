import {
  CodeOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Dropdown,
  Flex,
  Image,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import modal from 'antd/es/modal';
import dayjs from 'dayjs';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import DeviceCodeDrawer from '@/modules/devices/components/device-code-drawer';
import DeviceFormDrawer from '@/modules/devices/components/device-form-drawer';
import DevicePreviewDrawer from '@/modules/devices/components/device-preview-drawer';
import {
  EDeviceHardware,
  EDeviceStatus,
  TDevice,
} from '@/modules/devices/device.model';
import deviceService from '@/modules/devices/device.service';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute('/_app/projects/_$projectId/home')({
  component: ProjectIdHome,
});

function ProjectIdHome() {
  const { projectId } = Route.useParams();

  const { t, token, antdApp } = useApp();

  const [deviceFormAction, setDeviceFormAction] = useState<'create' | 'update'>(
    'create',
  );
  const [selectedDevice, setSelectedDevice] = useState<TDevice>();
  const [openDeviceFormDrawer, setOpenDeviceFormDrawer] = useState(false);
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState(false);
  const [openCodeDrawer, setOpenCodeDrawer] = useState(false);

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

      {selectedDevice?.id && (
        <DeviceCodeDrawer
          projectId={projectId}
          device={selectedDevice}
          open={openCodeDrawer}
          setOpen={setOpenCodeDrawer}
        />
      )}

      {selectedDevice?.id && (
        <DevicePreviewDrawer
          projectId={projectId}
          id={selectedDevice.id}
          open={openPreviewDrawer}
          setOpen={setOpenPreviewDrawer}
        />
      )}
      <Space
        size="large"
        direction="vertical"
        css={css`
          width: 100%;
        `}
      >
        <Flex justify="space-between">
          <Typography.Text
            strong
            css={css`
              font-size: ${token.fontSizeLG}px;
            `}
          >
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
                    css={css`
                      border-radius: ${token.borderRadius}px;
                    `}
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
                  color={status == EDeviceStatus.OFFLINE ? 'orange' : 'green'}
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
                    css={css`
                      max-width: 110px;
                    `}
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
                          setOpenPreviewDrawer(true);
                        },
                      },
                      {
                        label: t('Code'),
                        key: 'code',
                        icon: <CodeOutlined />,
                        onClick: () => {
                          setSelectedDevice(record);
                          setOpenCodeDrawer(true);
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
                              await deleteDeviceMutation.mutateAsync(record.id);
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
    </>
  );
}
