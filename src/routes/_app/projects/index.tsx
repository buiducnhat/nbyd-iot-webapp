import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Col, Empty, Flex, Input, Row, Space } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import ProjectCard from '@/modules/projects/components/project-card';
import ProjectFormDrawer from '@/modules/projects/components/project-form-drawer';
import useGetListProject from '@/modules/projects/hooks/use-get-list-project';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/projects/')({
  component: ProjectListPage,
});

function ProjectListPage() {
  const { t } = useApp();

  const [openFormDrawer, setOpenFormDrawer] = useState(false);

  const { listProject, listProjectQuery } = useGetListProject({});

  return (
    <>
      <ProjectFormDrawer
        action="create"
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        refetch={() => listProjectQuery.refetch()}
      />

      <Space
        size="large"
        direction="vertical"
        css={css`
          width: 100%;
        `}
      >
        <Flex align="center" justify="space-between">
          <TitleHeading>{t('Projects')}</TitleHeading>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenFormDrawer(true)}
          >
            {t('New project')}
          </Button>
        </Flex>

        <div
          css={css`
            max-width: 400px;
          `}
        >
          <Input.Search placeholder={t('Search Projects')} />
        </div>

        <Row gutter={[24, 24]}>
          {listProject?.length === 0 && (
            <Col span={24}>
              <Empty
                description={t(
                  'No project found. Create a new project to start',
                )}
              >
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => setOpenFormDrawer(true)}
                >
                  {t('Create')}
                </Button>
              </Empty>
            </Col>
          )}
          {listProject?.map((project) => (
            <Col key={project.id} xs={12} md={6} lg={4}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      </Space>
    </>
  );
}
