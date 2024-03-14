import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';
import { useMemo } from 'react';

import projectService from '../project.service';

function useGetProjectDetail(projectId: string) {
  const projectQuery = useQuery({
    queryKey: ['/projects/detail', projectId],
    queryFn: async () => projectService.getDetail(projectId),
  });

  const project = projectQuery.data?.data;

  const datastreams = useMemo(
    () => R.flatten(R.map((a) => a.datastreams, project?.devices || [])),
    [project],
  ).map((datastream) => ({
    ...datastream,
    device: project?.devices.find((device) =>
      device.datastreams.some((ds) => ds.id === datastream.id),
    ),
  }));

  const devices = useMemo(() => project?.devices || [], [project]);

  return {
    project,
    datastreams,
    devices,
    projectQuery,
  };
}

export default useGetProjectDetail;
