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

import { EGatewayStatus } from '../gateway.model';
import useGetGatewayDetail from '../hooks/use-get-gateway-detail';

type TGatewayPreviewDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
  id: string;
};

const GatewayPreviewDrawer: React.FC<TGatewayPreviewDrawerProps> = ({
  open,
  setOpen,
  projectId,
  id,
}: TGatewayPreviewDrawerProps) => {
  const { t } = useApp();

  const { gateway, gatewayQuery } = useGetGatewayDetail(projectId, id);

  return (
    <Drawer
      title={t('Preview')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {gatewayQuery.isLoading ? (
        <Skeleton />
      ) : !gatewayQuery?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title={t('Gateway')}
          items={[
            {
              label: t('ID'),
              span: 1,
              children: gateway?.id,
            },
            {
              label: '',
              span: 1,
              children: (
                <Image
                  src={
                    gateway?.imageFileUrl ||
                    '/assets/images/gateway-placeholder.jpeg'
                  }
                  width={64}
                />
              ),
            },
            {
              label: t('Name'),
              span: 1,
              children: <strong>{gateway?.name}</strong>,
            },
            {
              label: t('Status'),
              span: 1,
              children: (
                <Tag
                  color={
                    gateway?.status === EGatewayStatus.ONLINE
                      ? 'green'
                      : 'orange'
                  }
                >
                  {gateway?.status}
                </Tag>
              ),
            },
            {
              label: t('Hardware'),
              span: 1,
              children: <Tag color="blue">{gateway?.hardware}</Tag>,
            },
            {
              label: t('Connection'),
              span: 1,
              children: <Tag color="magenta">{gateway?.connection}</Tag>,
            },
            {
              label: t('Meta data'),
              span: 2,
              children: (
                <Space direction="vertical">
                  <Space>
                    <Typography.Text>{t('IP Address')}:</Typography.Text>
                    <Tag>{gateway?.metaData?.ipAddress}</Tag>
                  </Space>
                  <Space>
                    <Typography.Text>{t('MAC Address')}:</Typography.Text>
                    <Tag>{gateway?.metaData?.macAddress}</Tag>
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
                    {gateway?.authToken}
                  </Typography.Text>
                </Tag>
              ),
            },
            {
              label: t('Description'),
              span: 2,
              children: gateway?.description,
            },
            {
              label: t('Last online'),
              span: 2,
              children: dayjs(gateway?.lastOnlineAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Created at'),
              span: 2,
              children: dayjs(gateway?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default GatewayPreviewDrawer;
