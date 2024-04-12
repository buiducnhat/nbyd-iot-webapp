import httpService from '@/shared/http-service';

import { EDatastreamType, TDatastream } from './datastream.model';
import { TCreateDatastreamDto } from './dto/create-datastream.dto';
import { TUpdateDatastreamDto } from './dto/update-datastream.dto';

class DatastreamService {
  create(projectId: string, deviceId: string, data: TCreateDatastreamDto) {
    return httpService.request<TDatastream>({
      url: `/api/projects/${projectId}/devices/${deviceId}/datastreams`,
      method: 'POST',
      data,
    });
  }

  update(
    projectId: string,
    deviceId: string,
    id: string,
    data: TUpdateDatastreamDto,
  ) {
    return httpService.request<TDatastream>({
      url: `/api/projects/${projectId}/devices/${deviceId}/datastreams/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(projectId: string, deviceId: string, id: string) {
    return httpService.request<void>({
      url: `/api/projects/${projectId}/devices/${deviceId}/datastreams/${id}`,
      method: 'DELETE',
    });
  }

  deleteMany(projectId: string, deviceId: string, ids: string[]) {
    return httpService.request<void>({
      url: `/api/projects/${projectId}/devices/${deviceId}/datastreams`,
      method: 'DELETE',
      data: { ids },
    });
  }

  getListByProject(projectId: string, needValues = false) {
    return httpService.request<TDatastream[]>({
      url: `/api/projects/${projectId}/datastreams`,
      method: 'GET',
      params: { needValues },
    });
  }

  getValues(datastreamIds: string[]) {
    return httpService.request<{ [key: string]: string }>({
      url: `/api/datastreams/values`,
      method: 'POST',
      data: { datastreamIds },
    });
  }

  getListPinOptions(type: EDatastreamType, excludes?: string[]) {
    let result: Array<{ label: string; value: string; disabled?: boolean }> =
      [];

    switch (type) {
      case EDatastreamType.DIGITAL:
        result = Array.from({ length: 14 }, (_, i) => i).map((i) => ({
          label: `D${i}`,
          value: `D${i}`,
        }));
        break;
      case EDatastreamType.ANALOG:
        result = Array.from({ length: 6 }, (_, i) => i).map((i) => ({
          label: `A${i}`,
          value: `A${i}`,
        }));
        break;
      case EDatastreamType.VIRTUAL:
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

export default new DatastreamService();
