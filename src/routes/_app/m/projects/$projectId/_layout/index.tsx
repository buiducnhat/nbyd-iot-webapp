import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Descriptions, Dropdown, Flex, Image, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

import useApp from '@/hooks/use-app';
import GatewayFormDrawer from '@/modules/gateways/components/gateway-form-drawer';
import GatewayPreviewDrawer from '@/modules/gateways/components/gateway-preview-drawer';
import { EGatewayStatus } from '@/modules/gateways/gateway.model';
import gatewayService from '@/modules/gateways/gateway.service';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import SoftButton from '@/shared/components/soft-button';

export const Route = createFileRoute('/_app/m/projects/$projectId/_layout/')({
  component: ProjectIdMIndex,
});

function ProjectIdMIndex() {
  const { projectId } = Route.useParams();

  const { t, token, antdApp } = useApp();

  const { project, projectQuery } = useGetProjectDetail(projectId);

  const [openGatewayPreviewDrawer, setOpenGatewayPreviewDrawer] =
    useState(false);
  const [openGatewayFormDrawer, setOpenGatewayFormDrawer] = useState(false);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('');
  const [gatewayFormAction, setGatewayFormAction] = useState<
    'create' | 'update'
  >('create');

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
      <GatewayPreviewDrawer
        open={openGatewayPreviewDrawer}
        setOpen={setOpenGatewayPreviewDrawer}
        projectId={projectId}
        id={selectedGatewayId}
      />

      <GatewayFormDrawer
        open={openGatewayFormDrawer}
        setOpen={setOpenGatewayFormDrawer}
        action={gatewayFormAction}
        projectId={projectId}
        gateway={project?.gateways.find(
          (gateway) => gateway.id === selectedGatewayId,
        )}
        refetch={() => projectQuery.refetch()}
      />

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
            {t('Gateways')}
          </Typography.Text>

          <SoftButton
            $token={token}
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setGatewayFormAction('create');
              setOpenGatewayFormDrawer(true);
            }}
          >
            {t('New')}
          </SoftButton>
        </Flex>

        {project?.gateways.map((gateway) => (
          <Flex
            key={gateway.id}
            gap={token.sizeLG}
            css={css`
              position: relative;
              margin-bottom: ${token.margin}px;
              padding: ${token.paddingSM}px;
              border-radius: ${token.borderRadius}px;
              box-shadow: ${token.boxShadowSecondary};
              background-color: ${token.colorBgElevated};
            `}
          >
            <Flex
              vertical
              css={css`
                height: 100px;
                justify-content: space-between;
              `}
            >
              <Typography.Text
                css={css`
                  font-size: ${token.fontSizeLG}px;
                  font-weight: ${token.fontWeightStrong};
                  color: ${token.colorPrimary};
                `}
              >
                {gateway.name}
              </Typography.Text>

              <Image
                src={
                  gateway.imageFileUrl ||
                  '/assets/images/gateway-placeholder.jpeg'
                }
                width={64}
                height={64}
                css={css`
                  object-fit: cover;
                `}
              />
            </Flex>

            <Descriptions
              size="small"
              items={[
                {
                  label: t('Hardware'),
                  children: <Tag color="blue">{gateway.hardware}</Tag>,
                },
                {
                  label: t('Status'),
                  children: (
                    <Tag
                      color={
                        gateway.status === EGatewayStatus.OFFLINE
                          ? 'orange'
                          : 'green'
                      }
                    >
                      {gateway.status}
                    </Tag>
                  ),
                },
                {
                  label: t('Last online'),
                  children: (
                    <Typography.Text>
                      {gateway.lastOnlineAt
                        ? dayjs(gateway.lastOnlineAt).format('YYYY-MM-DD HH:mm')
                        : '-'}
                    </Typography.Text>
                  ),
                },
              ]}
            />

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
                      setSelectedGatewayId(gateway.id);
                      setOpenGatewayPreviewDrawer(true);
                    },
                  },
                  {
                    label: t('Edit'),
                    key: 'edit',
                    icon: <EditOutlined />,
                    onClick: () => {
                      setSelectedGatewayId(gateway.id);
                      setGatewayFormAction('update');
                      setOpenGatewayFormDrawer(true);
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
                          await deleteGatewayMutation.mutateAsync(gateway.id);
                        },
                      });
                    },
                  },
                ],
              }}
            >
              <MdMoreVert fontSize={20} />
            </Dropdown>
          </Flex>
        ))}
      </Flex>
    </>
  );
}
