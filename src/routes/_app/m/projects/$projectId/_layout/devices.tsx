import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Dropdown, Flex, Tag, Typography } from 'antd';
import { useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

import useApp from '@/hooks/use-app';
import DeviceFormDrawer from '@/modules/devices/components/device-form-drawer';
import DevicePreviewDrawer from '@/modules/devices/components/device-preview-drawer';
import {
  DeviceModeTag,
  DeviceTypeTag,
} from '@/modules/devices/components/device-tags';
import { TDevice } from '@/modules/devices/device.model';
import deviceService from '@/modules/devices/device.service';
import useGetListDevice from '@/modules/devices/hooks/use-get-list-device';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute(
  '/_app/m/projects/$projectId/_layout/devices',
)({
  component: ProjectIdMDevices,
});

function ProjectIdMDevices() {
  const { projectId } = Route.useParams();

  const { t, token, antdApp } = useApp();

  const { project } = useGetProjectDetail(projectId);
  const { devices, devicesQuery } = useGetListDevice(projectId);

  const [openPreview, setOpenPreview] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<TDevice>();

  const deleteDeviceMutation = useMutation({
    mutationFn: (device: TDevice) =>
      deviceService.delete(projectId, device.gatewayId, device.id),
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
      <DevicePreviewDrawer
        open={openPreview}
        setOpen={setOpenPreview}
        device={selectedDevice}
      />

      {project && (
        <>
          <DeviceFormDrawer
            open={openCreateForm}
            setOpen={setOpenPreview}
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

      <Flex vertical>
        <Flex justify="space-between">
          <Typography.Text
            type="secondary"
            css={css`
              font-weight: ${token.fontWeightStrong};
              font-size: ${token.fontSizeHeading5}px;
              margin-bottom: ${token.marginSM}px;
            `}
          >
            {t('Devices')}
          </Typography.Text>

          <SoftButton
            $token={token}
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenCreateForm(true);
            }}
          >
            {t('New')}
          </SoftButton>
        </Flex>

        {devices.map((device) => (
          <Flex
            vertical
            key={device.id}
            gap={token.paddingSM}
            css={css`
              position: relative;
              margin-bottom: ${token.marginSM}px;
              padding: ${token.paddingSM}px;
              border-radius: ${token.borderRadius}px;
              box-shadow: ${token.boxShadowSecondary};
              background-color: ${token.colorBgElevated};
            `}
          >
            <Flex
              vertical
              css={css`
                justify-content: space-between;
              `}
            >
              <Typography.Text
                css={css`
                  font-weight: ${token.fontWeightStrong};
                  color: ${token.colorPrimary};
                `}
              >
                {device.name}
                <span
                  css={css`
                    color: ${token.colorTextSecondary};
                    font-weight: lighter;
                  `}
                >
                  {` / ${device.gateway?.name}`}
                </span>
              </Typography.Text>
            </Flex>

            <Dropdown
              trigger={['click']}
              css={css`
                position: absolute;
                right: ${token.sizeSM}px;
                top: ${token.sizeSM}px;
              `}
              menu={{
                items: [
                  {
                    label: t('View'),
                    key: 'view',
                    icon: <EyeOutlined />,
                    onClick: () => {
                      setSelectedDevice(device);
                      setOpenPreview(true);
                    },
                  },
                  {
                    label: t('Edit'),
                    key: 'edit',
                    icon: <EditOutlined />,
                    onClick: () => {
                      setSelectedDevice(device);
                      setOpenUpdateForm(true);
                    },
                  },
                  {
                    label: t('Delete'),
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => {
                      antdApp.modal.confirm({
                        title: t('Delete confirmation'),
                        content: t(
                          'Are you sure you want to delete this item?',
                        ),
                        okText: t('Yes'),
                        cancelText: t('No'),
                        onOk: async () => {
                          await deleteDeviceMutation.mutateAsync(device);
                        },
                      });
                    },
                  },
                ],
              }}
            >
              <MdMoreVert fontSize={20} />
            </Dropdown>

            <Flex vertical gap={token.paddingXS}>
              <Flex>
                <DeviceTypeTag type={device.type} />
                {device.type === 'ZIGBEE' && <Tag>{device.mac}</Tag>}
              </Flex>
              <Flex>
                <Tag color={device.color}>{device.pin}</Tag>
                {device.mode && <DeviceModeTag mode={device.mode} />}
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  );
}
