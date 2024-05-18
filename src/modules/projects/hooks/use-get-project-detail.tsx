import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import projectService from '../project.service';

function useGetProjectDetail(projectId: string) {
  const projectQuery = useQuery({
    queryKey: ['/projects/detail', projectId],
    queryFn: async () => projectService.getDetail(projectId),
    enabled: !!projectId,
  });

  const project = projectQuery.data?.data;
  const gateways = useMemo(() => project?.gateways || [], [project]);

  return {
    project,
    gateways,
    projectQuery,
  };
}

export default useGetProjectDetail;
