import { useQuery } from '@tanstack/react-query';

import deviceService from '../device.service';

function useGetListDevice(projectId: string, needValues = false) {
  const devicesQuery = useQuery({
    queryKey: ['/projects/devices', projectId, needValues],
    queryFn: async () => deviceService.getListByProject(projectId, needValues),
    enabled: !!projectId,
  });

  const devices = devicesQuery.data?.data || [];

  return {
    devicesQuery,
    devices,
  };
}

export default useGetListDevice;
