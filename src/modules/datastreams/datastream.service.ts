import httpService from '@/shared/http-service';

import { EDatastreamType, TDatastream } from './datastream.model';
import { CreateDatastreamDto } from './dto/create-datastream.dto';
import { UpdateDatastreamDto } from './dto/update-datastream.dto';

class DatastreamService {
  create(projectId: string, deviceId: string, data: CreateDatastreamDto) {
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
    data: UpdateDatastreamDto,
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

  getListPinOptions(type: EDatastreamType) {
    switch (type) {
      case EDatastreamType.DIGITAL:
        return Array.from({ length: 14 }, (_, i) => i).map((i) => ({
          label: `D${i}`,
          value: `D${i}`,
        }));
      case EDatastreamType.ANALOG:
        return Array.from({ length: 6 }, (_, i) => i).map((i) => ({
          label: `A${i}`,
          value: `A${i}`,
        }));
      case EDatastreamType.VIRTUAL:
        return Array.from({ length: 256 }, (_, i) => i).map((i) => ({
          label: `V${i}`,
          value: `V${i}`,
        }));
      default:
        return [];
    }
  }
}

export default new DatastreamService();
