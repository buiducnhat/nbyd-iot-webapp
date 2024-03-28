import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
import modal from 'antd/es/modal';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import DatastreamFormDrawer from '@/modules/datastreams/components/datastream-form-drawer';
import {
  DatastreamDataTypeTag,
  DatastreamModeTag,
  DatastreamTypeTag,
} from '@/modules/datastreams/components/datastream-tags';
import {
  EDatastreamDataType,
  EDatastreamMode,
  EDatastreamType,
  TDatastream,
} from '@/modules/datastreams/datastream.model';
import datastreamService from '@/modules/datastreams/datastream.service';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute('/_app/projects/_$projectId/datastreams')({
  component: ProjectIdDatastreams,
});

function ProjectIdDatastreams() {
  const { projectId } = Route.useParams();

  const { t, token, antdApp } = useApp();

  const [selectedDatastreamIds, setSelectedDatastreamIds] = useState<
    React.Key[]
  >([]);
  const [selectedDatastream, setSelectedDatastream] = useState<TDatastream>();
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);

  const { project, datastreams, projectQuery } = useGetProjectDetail(projectId);

  const deleteDatastreamMutation = useMutation({
    mutationFn: (data: any) =>
      datastreamService.delete(projectId, data.deviceId, data.id),
    onSuccess: () => {
      projectQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const deleteDatastreamsMutation = useMutation({
    mutationFn: (data: any) =>
      datastreamService.deleteMany(projectId, data.deviceId, data.ids),
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
      {project && (
        <>
          <DatastreamFormDrawer
            open={openCreateForm}
            setOpen={setOpenCreateForm}
            project={project}
            refetch={projectQuery.refetch}
            datastreams={datastreams}
          />

          <DatastreamFormDrawer
            open={openUpdateForm}
            setOpen={setOpenUpdateForm}
            project={project}
            refetch={projectQuery.refetch}
            isUpdate
            datastreams={datastreams}
            datastream={selectedDatastream}
          />
        </>
      )}

      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <Space size="large">
            <Typography.Text strong style={{ fontSize: token.fontSizeLG }}>
              {t('datastreamWithCount', { count: datastreams?.length })}
            </Typography.Text>

            {selectedDatastreamIds.length > 0 && (
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
                      await deleteDatastreamsMutation.mutateAsync({
                        deviceId: selectedDatastream?.deviceId,
                        ids: selectedDatastreamIds as string[],
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
            {t('New') + ' ' + t('Datastream')}
          </SoftButton>
        </Flex>

        <Table
          dataSource={datastreams}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) =>
              setSelectedDatastreamIds(selectedRowKeys),
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
              title: t('Datastream'),
              dataIndex: 'name',
              key: 'name',
              render: (_id: string, record: TDatastream) => (
                <Space direction="vertical">
                  <Typography.Text strong style={{ color: token.colorPrimary }}>
                    {record.name}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {record.device?.name}
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
              render: (type: EDatastreamType) => (
                <DatastreamTypeTag type={type} />
              ),
            },
            {
              title: t('Pin'),
              dataIndex: 'pin',
              key: 'pin',
            },
            {
              title: t('Mode'),
              dataIndex: 'mode',
              key: 'mode',
              render: (mode: EDatastreamMode) => (
                <DatastreamModeTag mode={mode} />
              ),
            },
            {
              title: t('Data type'),
              dataIndex: 'dataType',
              key: 'dataType',
              render: (dataType: EDatastreamDataType) => (
                <DatastreamDataTypeTag dataType={dataType} />
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
                      // {
                      //   label: t('View'),
                      //   key: 'view',
                      //   icon: <EyeOutlined />,
                      //   onClick: () => {
                      //     setSelectedDevice(record);
                      //     // setOpenPreviewDrawer(true);
                      //   },
                      // },
                      {
                        label: t('Edit'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setOpenUpdateForm(true);
                          setSelectedDatastream(record);
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
                              await deleteDatastreamMutation.mutateAsync({
                                deviceId: record.deviceId,
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
