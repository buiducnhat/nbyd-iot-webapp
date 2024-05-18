import { useQuery } from '@tanstack/react-query';

import gatewayService from '../gateway.service';

function useGetGatewayDetail(projectId: string, id: string) {
  const gatewayQuery = useQuery({
    queryKey: [`/projects/${projectId}/gateways/detail`, id],
    queryFn: async () => gatewayService.getDetail(projectId, id),
    enabled: !!id,
  });
  const gateway = gatewayQuery.data?.data;

  return { gateway, gatewayQuery };
}

export default useGetGatewayDetail;
