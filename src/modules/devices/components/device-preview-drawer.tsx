import {
  Button,
  Descriptions,
  Drawer,
  Empty,
  Image,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';

import { EDeviceStatus } from '../device.model';
import useGetDeviceDetail from '../hooks/use-get-device-detail';

type TDevicePreviewDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
  id: string;
};

const DevicePreviewDrawer: React.FC<TDevicePreviewDrawerProps> = ({
  open,
  setOpen,
  projectId,
  id,
}: TDevicePreviewDrawerProps) => {
  const { t } = useApp();

  const { device, deviceQuery } = useGetDeviceDetail(projectId, id);

  return (
    <Drawer
      title={t('Preview')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {deviceQuery.isLoading ? (
        <Skeleton />
      ) : !deviceQuery?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title={t('Device')}
          items={[
            {
              label: t('ID'),
              span: 1,
              children: device?.id,
            },
            {
              label: '',
              span: 1,
              children: (
                <Image
                  src={
                    device?.imageFileUrl ||
                    '/assets/images/device-placeholder.jpeg'
                  }
                  width={64}
                />
              ),
            },
            {
              label: t('Name'),
              span: 1,
              children: <strong>{device?.name}</strong>,
            },
            {
              label: t('Status'),
              span: 1,
              children: (
                <Tag
                  color={
                    device?.status === EDeviceStatus.ONLINE ? 'green' : 'orange'
                  }
                >
                  {device?.status}
                </Tag>
              ),
            },
            {
              label: t('Hardware'),
              span: 1,
              children: <Tag color="blue">{device?.hardware}</Tag>,
            },
            {
              label: t('Connection'),
              span: 1,
              children: <Tag color="magenta">{device?.connection}</Tag>,
            },
            {
              label: t('Meta data'),
              span: 2,
              children: (
                <Space direction="vertical">
                  <Space>
                    <Typography.Text>{t('IP Address')}:</Typography.Text>
                    <Tag>{device?.metaData?.ipAddress}</Tag>
                  </Space>
                  <Space>
                    <Typography.Text>{t('MAC Address')}:</Typography.Text>
                    <Tag>{device?.metaData?.macAddress}</Tag>
                  </Space>
                </Space>
              ),
            },
            {
              label: t('Auth token'),
              span: 2,
              children: (
                <Tag>
                  <Typography.Text copyable>
                    {device?.authToken}
                  </Typography.Text>
                </Tag>
              ),
            },
            {
              label: t('Description'),
              span: 2,
              children: device?.description,
            },
            {
              label: t('Last online'),
              span: 2,
              children: dayjs(device?.lastOnlineAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Created at'),
              span: 2,
              children: dayjs(device?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default DevicePreviewDrawer;
