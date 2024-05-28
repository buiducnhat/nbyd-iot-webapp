import { css } from '@emotion/react';
import { Link } from '@tanstack/react-router';
import { Card } from 'antd';

import useApp from '@/hooks/use-app';
import useDeviceSize from '@/hooks/use-device-size';

import { TProjectBasic } from '../project.model';

type TProjectCardProps = {
  project: TProjectBasic;
};

const ProjectCard = ({ project }: TProjectCardProps) => {
  const { t, token } = useApp();

  const { isMobile } = useDeviceSize();

  return (
    <Link
      to={isMobile ? '/m/projects/$projectId' : '/d/projects/$projectId'}
      params={{ projectId: project.id }}
    >
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
