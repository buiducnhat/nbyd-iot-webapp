import { createFileRoute } from '@tanstack/react-router';
import { Image, Space, Table, Tag, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { EDeviceHardware, EDeviceStatus } from '@/modules/devices/device.model';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';

export const Route = createFileRoute('/_app/projects/_$projectId/home')({
  component: ProjectIdHome,
});

function ProjectIdHome() {
  const { projectId } = Route.useParams();

  const { t } = useTranslation();

  const { token } = theme.useToken();

  const { project } = useGetProjectDetail(projectId);

  return (
    <Space size="large" direction="vertical">
      <Typography.Text strong style={{ fontSize: 16 }}>
        {t('deviceWithCount_other', { count: project?.devices.length })}
      </Typography.Text>

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
                color={status == EDeviceStatus.OFFLINE ? 'warning' : 'success'}
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
                <Typography.Text copyable ellipsis style={{ maxWidth: 110 }}>
                  {authToken}
                </Typography.Text>
              </Tag>
            ),
          },
        ]}
      />
    </Space>
  );
}
