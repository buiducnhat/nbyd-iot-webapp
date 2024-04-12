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
  const devices = useMemo(() => project?.devices || [], [project]);

  return {
    project,
    devices,
    projectQuery,
  };
}

export default useGetProjectDetail;
