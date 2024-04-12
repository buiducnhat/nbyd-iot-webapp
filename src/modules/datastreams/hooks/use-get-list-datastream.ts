import { useQuery } from '@tanstack/react-query';

import datastreamService from '../datastream.service';

function useGetListDatastream(projectId: string, needValues = false) {
  const datastreamsQuery = useQuery({
    queryKey: ['/projects/datastreams', projectId, needValues],
    queryFn: async () =>
      datastreamService.getListByProject(projectId, needValues),
    enabled: !!projectId,
  });

  const datastreams = datastreamsQuery.data?.data || [];

  return {
    datastreamsQuery,
    datastreams,
  };
}

export default useGetListDatastream;
