import { useQuery } from '@tanstack/react-query';

import projectService from '../project.service';

function useGetProjectDetail(projectId: string) {
  const projectQuery = useQuery({
    queryKey: ['/projects/detail', projectId],
    queryFn: async () => projectService.getDetail(projectId),
  });
  const project = projectQuery.data?.data;

  return { project, projectQuery };
}

export default useGetProjectDetail;
