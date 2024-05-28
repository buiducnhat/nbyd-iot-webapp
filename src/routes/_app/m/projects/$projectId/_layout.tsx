import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Outlet, createFileRoute, useRouter } from '@tanstack/react-router';
import { Button, Col, Divider, Dropdown, Flex, Row, Typography } from 'antd';
import { useState } from 'react';
import { MdDeviceHub, MdSensors } from 'react-icons/md';
import { TfiLayoutMenuV } from 'react-icons/tfi';

import useApp from '@/hooks/use-app';
import ProjectFormDrawer from '@/modules/projects/components/project-form-drawer';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import projectService from '@/modules/projects/project.service';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/m/projects/$projectId/_layout')({
  component: ProjectIdMLayout,
});

function ProjectIdMLayout() {
  const { projectId } = Route.useParams();

  const navigate = Route.useNavigate();
  const router = useRouter();

  const { t, token, antdApp } = useApp();

  const [openProjectFormDrawer, setOpenProjectFormDrawer] = useState(false);

  const { project, projectQuery } = useGetProjectDetail(projectId);

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectService.delete(projectId),
    onSuccess: () => {
      navigate({ to: '/m/projects' });
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const bottomTabData = [
    {
      key: 'home',
      label: t('Project'),
      path: '',
      Icon: MdDeviceHub,
    },
    {
      key: 'devices',
      label: t('Devices'),
      path: '/devices',
      Icon: MdSensors,
    },
    {
      key: 'dashboard',
      label: t('Dashboard'),
      path: '/dashboard',
      Icon: TfiLayoutMenuV,
    },
  ];

  return (
    <>
      <ProjectFormDrawer
        open={openProjectFormDrawer}
        setOpen={setOpenProjectFormDrawer}
        action="update"
        id={projectId}
        refetch={() => projectQuery.refetch()}
      />

      <Flex
        vertical
        css={css`
          height: 100%;
        `}
      >
        <div
          css={css`
            flex: 1;
            overflow-y: auto;
            padding: ${token.paddingSM}px;
          `}
        >
          <Flex vertical>
            <Flex
              justify="space-between"
              align="center"
              css={css`
                width: 100%;
              `}
            >
              <TitleHeading>{project?.name || ''}</TitleHeading>

              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      label: t('Edit'),
                      key: 'edit',
                      icon: <EditOutlined />,
                      onClick: () => setOpenProjectFormDrawer(true),
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
                            await deleteProjectMutation.mutateAsync(projectId);
                          },
                        });
                      },
                    },
                  ],
                }}
              >
                <Button
                  type="primary"
                  icon={
                    <MoreOutlined
                      css={css`
                        transform: rotate(90deg);
                      `}
                    />
                  }
                />
              </Dropdown>
            </Flex>

            <Divider
              css={css`
                margin: ${token.marginSM}px 0;
              `}
            />
            <Outlet />
          </Flex>
        </div>

        <Row
          css={css`
            box-shadow: ${token.boxShadow};
            padding: ${token.paddingXS}px;
          `}
        >
          {bottomTabData.map((tab) => {
            const active =
              router.history.location.pathname ===
              `/m/projects/${projectId}${tab.path}`;

            return (
              <Col span={8} key={tab.key}>
                <Flex
                  vertical
                  justify="center"
                  align="center"
                  css={css`
                    width: 100%;
                    height: 100%;
                  `}
                >
                  <tab.Icon
                    size={token.fontSizeHeading4}
                    color={
                      active ? token.colorPrimary : token.colorTextSecondary
                    }
                  />
                  <Typography.Text
                    css={css`
                      font-weight: ${active ? 'bold' : 'normal'};
                      font-size: ${token.fontSizeSM}px;
                      color: ${active
                        ? token.colorPrimary
                        : token.colorTextSecondary};
                    `}
                    onClick={() =>
                      navigate({
                        to: `/m/projects/$projectId${tab.path}`,
                        params: { projectId },
                      })
                    }
                  >
                    {tab.label}
                  </Typography.Text>
                </Flex>
              </Col>
            );
          })}
        </Row>
      </Flex>
    </>
  );
}
