import { CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Badge, Button, Flex, Space, Table, Tag, Typography } from 'antd';
import * as R from 'ramda';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import {
  EDatastreamDataType,
  EDatastreamMode,
  EDatastreamType,
} from '@/modules/datastreams/datastream.model';
import { TDevice } from '@/modules/devices/device.model';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute('/_app/projects/_$projectId/datastreams')({
  component: ProjectIdDatastreams,
});

function ProjectIdDatastreams() {
  const { projectId } = Route.useParams();

  const { t, token, isDarkTheme } = useApp();

  const [selectedDevice, setSelectedDevice] = useState<TDevice>();

  const { project } = useGetProjectDetail(projectId);
  const datastreams = R.flatten(
    R.map((a) => a.datastreams, project?.devices || []),
  );

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <Typography.Text strong style={{ fontSize: token.fontSizeLG }}>
          {t('datastreamWithCount', { count: datastreams?.length })}
        </Typography.Text>

        <SoftButton
          token={token}
          type="primary"
          size="small"
          icon={<PlusOutlined />}
        >
          {t('New') + ' ' + t('Datastream')}
        </SoftButton>
      </Flex>

      <Table
        dataSource={datastreams}
        pagination={false}
        bordered
        columns={[
          {
            dataIndex: 'id',
            key: 'id',
            render: (_id: string, _record, index: number) => index + 1,
          },
          {
            title: t('Datastream'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
              <Space direction="vertical" align="center">
                <Typography.Text strong>{name}</Typography.Text>
              </Space>
            ),
          },
          {
            title: t('Type'),
            dataIndex: 'type',
            key: 'type',
            render: (type: EDatastreamType) => <Tag color="blue">{type}</Tag>,
          },
          {
            title: t('Mode'),
            dataIndex: 'mode',
            key: 'mode',
            render: (mode: EDatastreamMode) => (
              <Tag
              // color={status == EDeviceStatus.OFFLINE ? 'warning' : 'success'}
              >
                {mode}
              </Tag>
            ),
          },
          {
            title: t('Data type'),
            dataIndex: 'dataType',
            key: 'dataType',
            render: (dataType: EDatastreamDataType) => (
              <Tag color="blue">{dataType}</Tag>
            ),
          },
          {
            title: t('Action'),
            dataIndex: '',
            key: 'action',
            render: (record: TDevice) => (
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
  );
}
