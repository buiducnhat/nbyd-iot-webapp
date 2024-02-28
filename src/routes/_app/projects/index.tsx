import { PlusOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Col, Flex, Input, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import ProjectCard from '@/modules/projects/components/project-card';
import useGetListProject from '@/modules/projects/hooks/use-get-list-project';

export const Route = createFileRoute('/_app/projects/')({
  component: ProjectListPage,
});

function ProjectListPage() {
  const { t } = useTranslation();

  const { listProject } = useGetListProject({});

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <Flex align="center" justify="space-between">
        <Typography.Title level={3}>{t('Projects')}</Typography.Title>

        <Button icon={<PlusOutlined />} type="primary">
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
  );
}
