import { PlusOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Col, Flex, Input, Row, Space, Typography } from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import ProjectCard from '@/modules/projects/components/project-card';
import ProjectFormDrawer from '@/modules/projects/components/project-form-drawer';
import useGetListProject from '@/modules/projects/hooks/use-get-list-project';

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

      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Flex align="center" justify="space-between">
          <Typography.Title level={3}>{t('Projects')}</Typography.Title>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenFormDrawer(true)}
          >
            {t('New project')}
          </Button>
        </Flex>

        <div style={{ maxWidth: 400 }}>
          <Input.Search placeholder={t('Search Projects')} />
        </div>

        <Row gutter={[24, 24]}>
          {listProject?.map((project) => (
            <Col key={project.id} span={4}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      </Space>
    </>
  );
}
