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
import GatewayCodeDrawer from '@/modules/gateways/components/gateway-code-drawer';
import GatewayFormDrawer from '@/modules/gateways/components/gateway-form-drawer';
import GatewayPreviewDrawer from '@/modules/gateways/components/gateway-preview-drawer';
import {
  EGatewayConnection,
  EGatewayHardware,
  EGatewayStatus,
  TGateway,
} from '@/modules/gateways/gateway.model';
import gatewayService from '@/modules/gateways/gateway.service';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute(
  '/_app/d/projects/$projectId/_layout/gateways',
)({
  component: ProjectIdGateways,
});

function ProjectIdGateways() {
  const { projectId } = Route.useParams();

  const { t, token, antdApp } = useApp();

  const [gatewayFormAction, setGatewayFormAction] = useState<
    'create' | 'update'
  >('create');
  const [selectedGateway, setSelectedGateway] = useState<TGateway>();
  const [openGatewayFormDrawer, setOpenGatewayFormDrawer] = useState(false);
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState(false);
  const [openCodeDrawer, setOpenCodeDrawer] = useState(false);

  const { project, projectQuery } = useGetProjectDetail(projectId);

  const deleteGatewayMutation = useMutation({
    mutationFn: (gatewayId: string) =>
      gatewayService.delete(projectId, gatewayId),
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
      <GatewayFormDrawer
        action={gatewayFormAction}
        open={openGatewayFormDrawer}
        setOpen={setOpenGatewayFormDrawer}
        projectId={projectId}
        gateway={selectedGateway}
        refetch={() => projectQuery.refetch()}
      />

      {selectedGateway?.id && (
        <GatewayCodeDrawer
          projectId={projectId}
          gateway={selectedGateway}
          open={openCodeDrawer}
          setOpen={setOpenCodeDrawer}
        />
      )}

      {selectedGateway?.id && (
        <GatewayPreviewDrawer
          projectId={projectId}
          id={selectedGateway.id}
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
            {t('gatewayWithCount', { count: project?.gateways.length })}
          </Typography.Text>

          <SoftButton
            $token={token}
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setGatewayFormAction('create');
              setOpenGatewayFormDrawer(true);
            }}
          >
            {t('New gateway')}
          </SoftButton>
        </Flex>

        <Table
          dataSource={project?.gateways}
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
              title: t('Gateway'),
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
                      '/assets/images/gateway-placeholder.jpeg'
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
              render: (hardware: EGatewayHardware) => (
                <Tag color="blue">{hardware}</Tag>
              ),
            },
            {
              title: t('Status'),
              dataIndex: 'status',
              key: 'status',
              render: (status: EGatewayStatus) => (
                <Tag
                  color={status === EGatewayStatus.OFFLINE ? 'orange' : 'green'}
                >
                  {status}
                </Tag>
              ),
            },
            {
              title: t('Connection'),
              dataIndex: 'connection',
              key: 'connection',
              render: (status: EGatewayConnection) => (
                <Tag
                  color={
                    status === EGatewayConnection.WIFI ? 'success' : 'default'
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
                          setSelectedGateway(record);
                          setOpenPreviewDrawer(true);
                        },
                      },
                      {
                        label: t('Code'),
                        key: 'code',
                        icon: <CodeOutlined />,
                        onClick: () => {
                          setSelectedGateway(record);
                          setOpenCodeDrawer(true);
                        },
                      },
                      {
                        label: t('Edit'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setGatewayFormAction('update');
                          setSelectedGateway(record);
                          setOpenGatewayFormDrawer(true);
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
                              await deleteGatewayMutation.mutateAsync(
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
    </>
  );
}
