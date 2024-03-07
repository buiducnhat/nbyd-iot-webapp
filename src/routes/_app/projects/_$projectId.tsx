import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Dropdown, Image, Space, Tabs, Typography } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-use';

import useApp from '@/hooks/use-app';
import ProjectFormDrawer from '@/modules/projects/components/project-form-drawer';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import projectService from '@/modules/projects/project.service';

export const Route = createFileRoute('/_app/projects/_$projectId')({
  component: ProjectDetailPage,
  notFoundComponent: () => <Typography.Text>Not found</Typography.Text>,
});

function ProjectDetailPage() {
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

      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Space align="start" size="large">
          <Image
            width={120}
            height={120}
            src={
              project?.imageFile?.path ||
              '/assets/images/project-placeholder.jpeg'
            }
            style={{
              border: `1px solid ${token.colorBorder}`,
              borderRadius: token.borderRadius,
            }}
          />

          <Space direction="vertical" style={{ display: 'flex' }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {project?.name}
            </Typography.Title>
            <Typography.Text type="secondary">
              {project?.description}
            </Typography.Text>
            <Dropdown.Button
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
                      content: t('Are you sure you want to delete this item?'),
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
          </Space>
        </Space>

        <Tabs
          size="large"
          defaultActiveKey="home"
          onChange={(key) => {
            navigate({
              to: `/projects/${projectId}/${key}` as string,
              params: { projectId },
            });
          }}
          activeKey={location.pathname?.split('/').pop()}
          items={[
            {
              key: 'home',
              label: t('Home'),
              children: <Outlet />,
            },
            {
              key: 'datastreams',
              label: t('Datastreams'),
              children: <Outlet />,
            },
            {
              key: 'dashboard',
              label: t('Dashboard'),
              children: <Outlet />,
            },
          ]}
        />
      </Space>
    </>
  );
}
