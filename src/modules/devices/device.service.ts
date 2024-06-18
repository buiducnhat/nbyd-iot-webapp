import httpService from '@/shared/http-service';

import { EDeviceType, TDevice } from './device.model';
import { TCreateDeviceDto } from './dto/create-device.dto';
import { TUpdateDeviceDto } from './dto/update-device.dto';

class DeviceService {
  create(projectId: string, gatewayId: string, data: TCreateDeviceDto) {
    return httpService.request<TDevice>({
      url: `/api/projects/${projectId}/gateways/${gatewayId}/devices`,
      method: 'POST',
      data,
    });
  }

  update(
    projectId: string,
    gatewayId: string,
    id: string,
    data: TUpdateDeviceDto,
  ) {
    return httpService.request<TDevice>({
      url: `/api/projects/${projectId}/gateways/${gatewayId}/devices/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(projectId: string, gatewayId: string, id: string) {
    return httpService.request<void>({
      url: `/api/projects/${projectId}/gateways/${gatewayId}/devices/${id}`,
      method: 'DELETE',
    });
  }

  deleteMany(projectId: string, gatewayId: string, ids: string[]) {
    return httpService.request<void>({
      url: `/api/projects/${projectId}/gateways/${gatewayId}/devices`,
      method: 'DELETE',
      data: { ids },
    });
  }

  getListByProject(projectId: string, limitValue = 0) {
    return httpService.request<TDevice[]>({
      url: `/api/projects/${projectId}/devices`,
      method: 'GET',
      params: { limitValue },
    });
  }

  getValues(deviceIds: string[]) {
    return httpService.request<{ [key: string]: string }>({
      url: `/api/devices/values`,
      method: 'POST',
      data: { deviceIds },
    });
  }

  getListPinOptions(type: EDeviceType, excludes?: string[]) {
    let result: Array<{ label: string; value: string; disabled?: boolean }> =
      [];

    switch (type) {
      case EDeviceType.DIGITAL:
        result = Array.from({ length: 20 }, (_, i) => i).map((i) => ({
          label: `D${i}`,
          value: `D${i}`,
        }));
        break;
      case EDeviceType.ANALOG:
        result = Array.from({ length: 6 }, (_, i) => i).map((i) => ({
          label: `A${i}`,
          value: `A${i}`,
        }));
        break;
      case EDeviceType.VIRTUAL:
        result = Array.from({ length: 256 }, (_, i) => i).map((i) => ({
          label: `V${i}`,
          value: `V${i}`,
        }));
        break;
      default:
        break;
    }

    return result.map((item) => ({
      ...item,
      disabled: excludes?.includes(item.value),
    }));
  }
}

export default new DeviceService();
