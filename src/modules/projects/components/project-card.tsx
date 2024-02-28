import { Link } from '@tanstack/react-router';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { TProjectBasic } from '../project.model';

type TProjectCardProps = {
  project: TProjectBasic;
};

const ProjectCard = ({ project }: TProjectCardProps) => {
  const { t } = useTranslation();

  return (
    <Link to="/projects/$projectId" params={{ projectId: project.id }}>
      <Card
        hoverable
        cover={
          <img
            alt={project.name}
            src={
              project.imageFile?.path ||
              '/assets/images/project-placeholder.jpeg'
            }
          />
        }
      >
        <Card.Meta
          title={project.name}
          description={t('deviceWithCount', { count: project._count.devices })}
        />
      </Card>
    </Link>
  );
};

export default ProjectCard;
