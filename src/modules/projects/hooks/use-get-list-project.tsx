import { useQuery } from '@tanstack/react-query';

import { TGetListProjectDto } from '../dto/get-list-project.dto';
import projectService from '../project.service';

function useGetListProject(query: TGetListProjectDto) {
  const listProjectQuery = useQuery({
    queryKey: ['/projects/list', query],
    queryFn: async () => projectService.getList(query),
  });
  const listProject = listProjectQuery.data?.data;

  return { listProject, listProjectQuery };
}

export default useGetListProject;
