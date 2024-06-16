import {
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
  ColorPicker,
  Dropdown,
  Flex,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import DeviceFormDrawer from '@/modules/devices/components/device-form-drawer';
import DevicePreviewDrawer from '@/modules/devices/components/device-preview-drawer';
import {
  DeviceDataTypeTag,
  DeviceModeTag,
  DeviceTypeTag,
} from '@/modules/devices/components/device-tags';
import {
  EDeviceDataType,
  EDeviceMode,
  EDeviceType,
  TDevice,
} from '@/modules/devices/device.model';
import deviceService from '@/modules/devices/device.service';
import useGetListDevice from '@/modules/devices/hooks/use-get-list-device';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute(
  '/_app/d/projects/$projectId/_layout/devices',
)({
  component: ProjectIdDevices,
});

function ProjectIdDevices() {
  const { projectId } = Route.useParams();

  const { t, token, antdApp } = useApp();
  const modal = antdApp.modal;

  const [selectedDeviceIds, setSelectedDeviceIds] = useState<React.Key[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<TDevice>();
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);

  const { project } = useGetProjectDetail(projectId);
  const { devices, devicesQuery } = useGetListDevice(projectId);

  const deleteDeviceMutation = useMutation({
    mutationFn: (data: any) =>
      deviceService.delete(projectId, data.gatewayId, data.id),
    onSuccess: () => {
      devicesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const deleteDevicesMutation = useMutation({
    mutationFn: (data: any) =>
      deviceService.deleteMany(projectId, data.gatewayId, data.ids),
    onSuccess: () => {
      devicesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <>
      {project && (
        <>
          <DevicePreviewDrawer
            open={openPreviewDrawer}
            setOpen={setOpenPreviewDrawer}
            device={selectedDevice}
          />

          <DeviceFormDrawer
            open={openCreateForm}
            setOpen={setOpenCreateForm}
            project={project}
            refetch={devicesQuery.refetch}
            devices={devices}
          />

          <DeviceFormDrawer
            open={openUpdateForm}
            setOpen={setOpenUpdateForm}
            project={project}
            refetch={devicesQuery.refetch}
            isUpdate
            devices={devices}
            device={selectedDevice}
          />
        </>
      )}

      <Space
        size="large"
        direction="vertical"
        css={css`
          width: 100%;
        `}
      >
        <Flex justify="space-between">
          <Space size="large">
            <Typography.Text
              strong
              css={css`
                font-size: ${token.fontSizeLG}px;
              `}
            >
              {devices?.length +
                ' ' +
                t(devices?.length === 1 ? 'device' : 'devices')}
            </Typography.Text>

            {selectedDeviceIds.length > 0 && (
              <Button
                size="small"
                danger
                type="dashed"
                onClick={() => {
                  modal.confirm({
                    title: t('Delete confirmation'),
                    content: t(
                      'Are you sure you want to delete the selected items?',
                    ),
                    okText: t('Yes'),
                    cancelText: t('No'),
                    onOk: async () => {
                      await deleteDevicesMutation.mutateAsync({
                        gatewayId: selectedDevice?.gatewayId,
                        ids: selectedDeviceIds as string[],
                      });
                    },
                  });
                }}
              >
                {t('Delete selected')}
              </Button>
            )}
          </Space>

          <SoftButton
            $token={token}
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreateForm(true)}
          >
            {t('New') + ' ' + t('Device')}
          </SoftButton>
        </Flex>

        <Table
          dataSource={devices}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) =>
              setSelectedDeviceIds(selectedRowKeys),
          }}
          rowKey={(record) => record.id}
          pagination={false}
          bordered
          columns={[
            {
              title: t('No.'),
              dataIndex: 'id',
              key: 'id',
              render: (_id: string, _record, index: number) => index + 1,
            },
            {
              title: t('Device'),
              dataIndex: 'name',
              key: 'name',
              render: (_id: string, record: TDevice) => (
                <Space direction="vertical">
                  <Typography.Text
                    strong
                    css={css`
                      color: ${token.colorPrimary};
                    `}
                  >
                    {record.name}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    css={css`
                      font-size: ${token.fontSizeSM}px;
                    `}
                  >
                    {record.gateway?.name}
                  </Typography.Text>
                </Space>
              ),
            },
            {
              title: t('Color'),
              dataIndex: 'color',
              key: 'color',
              render: (color: string) => <ColorPicker value={color} disabled />,
            },
            {
              title: t('Type'),
              dataIndex: 'type',
              key: 'type',
              render: (_, record) => (
                <Space direction="vertical">
                  <DeviceTypeTag type={record.type} />
                  {record.type === EDeviceType.ZIGBEE && (
                    <Tag>{record.mac}</Tag>
                  )}
                </Space>
              ),
            },
            {
              title: t('Pin/Zigbee Type'),
              dataIndex: 'pin',
              key: 'pin',
              render: (pin: string, record) => (
                <Tag color={record?.color}>{pin}</Tag>
              ),
            },
            {
              title: t('Mode'),
              dataIndex: 'mode',
              key: 'mode',
              render: (mode: EDeviceMode) => <DeviceModeTag mode={mode} />,
            },
            {
              title: t('Data type'),
              dataIndex: 'dataType',
              key: 'dataType',
              render: (dataType: EDeviceDataType) => (
                <DeviceDataTypeTag dataType={dataType} />
              ),
            },
            {
              title: t('Unit'),
              dataIndex: 'unit',
              key: 'unit',
            },
            {
              title: t('Min'),
              dataIndex: 'minValue',
              key: 'minValue',
            },
            {
              title: t('Max'),
              dataIndex: 'maxValue',
              key: 'maxValue',
            },
            {
              title: t('Default'),
              dataIndex: 'defaultValue',
              key: 'defaultValue',
            },
            {
              title: t('History'),
              dataIndex: 'enabledHistory',
              key: 'enabledHistory',
              render: (enabledHistory: boolean) => (
                <Tag color={enabledHistory ? 'green' : 'gold'}>
                  {enabledHistory ? t('Yes') : t('No')}
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
                        label: t('Edit'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setOpenUpdateForm(true);
                          setSelectedDevice(record);
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
                              await deleteDeviceMutation.mutateAsync({
                                gatewayId: record.gatewayId,
                                id: record.id,
                              });
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
