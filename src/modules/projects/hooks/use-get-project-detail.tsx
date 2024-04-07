import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import projectService from '../project.service';

function useGetProjectDetail(
  projectId: string,
  historyFrom?: Date,
  historyTo?: Date,
) {
  const projectQuery = useQuery({
    queryKey: ['/projects/detail', projectId],
    queryFn: async () => projectService.getDetail(projectId),
    enabled: !!projectId,
  });

  const datastreamsQuery = useQuery({
    queryKey: ['/projects/datastreams', projectId],
    queryFn: async () =>
      projectService.getListDatastream(projectId, historyFrom, historyTo),
    enabled: !!projectId,
  });

  const project = projectQuery.data?.data;

  const datastreams = datastreamsQuery.data?.data || [];

  const devices = useMemo(() => project?.devices || [], [project]);

  return {
    project,
    datastreams,
    devices,
    projectQuery,
  };
}

export default useGetProjectDetail;
