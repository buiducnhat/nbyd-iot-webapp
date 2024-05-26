import { DeleteOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ConfigProvider,
  Dropdown,
  Flex,
  Image,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-use';

import useApp from '@/hooks/use-app';
import ProjectFormDrawer from '@/modules/projects/components/project-form-drawer';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import projectService from '@/modules/projects/project.service';

export const Route = createFileRoute('/_app/projects/$projectId/_layout')({
  component: ProjectIdLayout,
});

function ProjectIdLayout() {
  const { projectId } = Route.useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const { t, token, antdApp } = useApp();

  const [openFormDrawer, setOpenFormDrawer] = useState(false);

  const { project, projectQuery } = useGetProjectDetail(projectId);

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectService.delete(projectId),
    onSuccess: () => {
      navigate({ to: '/projects' });
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  return (
    <>
      <ProjectFormDrawer
        action="update"
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        id={projectId}
        refetch={() => projectQuery.refetch()}
      />

      <Space
        size="large"
        direction="vertical"
        css={css`
          width: 100%;
        `}
      >
        <Flex gap="large">
          {!project ? (
            <Space>
              <Skeleton.Image active />
              <Space direction="vertical">
                <Skeleton.Input active />
                <Skeleton.Button active />
              </Space>
            </Space>
          ) : (
            <>
              <Image
                width={120}
                height={120}
                src={
                  project?.imageFileUrl ||
                  '/assets/images/project-placeholder.jpeg'
                }
                css={css`
                  border: 1px solid ${token.colorBorder};
                  border-radius: ${token.borderRadius}px;
                `}
              />

              <Flex
                vertical
                css={css`
                  height: 120px;
                  width: 200px;
                  justify-content: space-between;
                `}
              >
                <Space direction="vertical">
                  <Typography.Title
                    level={3}
                    css={css`
                      margin: 0;
                    `}
                  >
                    {project?.name}
                  </Typography.Title>
                </Space>

                <Dropdown.Button
                  css={css`
                    justify-self: flex-end;
                  `}
                  trigger={['click']}
                  type="primary"
                  menu={{
                    items: [
                      {
                        label: t('Delete'),
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                      },
                    ],
                    onClick: (item) => {
                      if (item.key === 'delete') {
                        antdApp.modal.confirm({
                          title: t('Delete confirmation'),
                          content: t(
                            'Are you sure you want to delete this item?',
                          ),
                          okText: t('Yes'),
                          cancelText: t('No'),
                          onOk: async () => {
                            await deleteProjectMutation.mutateAsync(projectId);
                          },
                        });
                      }
                    },
                  }}
                  onClick={() => {
                    setOpenFormDrawer(true);
                  }}
                >
                  {t('Edit')}
                </Dropdown.Button>
              </Flex>
            </>
          )}

          <ConfigProvider
            theme={{ components: { Tabs: { horizontalMargin: '0px' } } }}
          >
            <Tabs
              css={css`
                align-self: flex-end;
              `}
              size="large"
              defaultActiveKey="gateways"
              onChange={(key) => {
                navigate({
                  to:
                    key === 'gateways'
                      ? '/projects/$projectId/'
                      : key === 'devices'
                        ? '/projects/$projectId/devices'
                        : '/projects/$projectId/dashboard',
                  params: { projectId },
                });
              }}
              activeKey={location.pathname?.split('/').pop()}
              items={[
                {
                  key: 'gateways',
                  label: t('Gateways'),
                },
                {
                  key: 'devices',
                  label: t('Devices'),
                },
                {
                  key:
                    location.pathname?.split('/').pop() === 'dashboard'
                      ? 'dashboard'
                      : 'edit',
                  label: t('Dashboard'),
                },
              ]}
            />
          </ConfigProvider>
        </Flex>

        <Outlet />
      </Space>
    </>
  );
}
