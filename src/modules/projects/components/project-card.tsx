import { css } from '@emotion/react';
import { Link } from '@tanstack/react-router';
import { Card } from 'antd';

import useApp from '@/hooks/use-app';

import { TProjectBasic } from '../project.model';

type TProjectCardProps = {
  project: TProjectBasic;
};

const ProjectCard = ({ project }: TProjectCardProps) => {
  const { t, token } = useApp();

  return (
    <Link to="/projects/$projectId/gateways" params={{ projectId: project.id }}>
      <Card
        hoverable
        bordered={false}
        cover={
          <img
            alt={project.name}
            src={
              project.imageFileUrl || '/assets/images/project-placeholder.jpeg'
            }
          />
        }
        css={css`
          background-color: ${token.colorBgLayout};
        `}
      >
        <Card.Meta
          title={project.name}
          description={t('gatewayWithCount', {
            count: project._count.gateways,
          })}
        />
      </Card>
    </Link>
  );
};

export default ProjectCard;
