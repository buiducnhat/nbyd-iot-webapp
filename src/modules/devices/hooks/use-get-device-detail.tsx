import { useQuery } from '@tanstack/react-query';

import deviceService from '../device.service';

function useGetDeviceDetail(projectId: string, id: string) {
  const deviceQuery = useQuery({
    queryKey: [`/projects/${projectId}/devices/detail`, id],
    queryFn: async () => deviceService.getDetail(projectId, id),
    enabled: !!id,
  });
  const device = deviceQuery.data?.data;

  return { device, deviceQuery };
}

export default useGetDeviceDetail;
