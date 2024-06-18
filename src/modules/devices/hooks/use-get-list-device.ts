import { useQuery } from '@tanstack/react-query';

import deviceService from '../device.service';

function useGetListDevice(projectId: string, limitValue = 0) {
  const devicesQuery = useQuery({
    queryKey: ['/projects/devices', projectId, limitValue],
    queryFn: async () => deviceService.getListByProject(projectId, limitValue),
    enabled: !!projectId,
  });

  const devices = devicesQuery.data?.data || [];

  return {
    devicesQuery,
    devices,
  };
}

export default useGetListDevice;
