import httpService from '@/shared/http-service';

import { TDevice } from './device.model';
import { TCreateDeviceDto } from './dto/create-device.dto';

class DeviceService {
  create(projectId: string, data: TCreateDeviceDto) {
    return httpService.request<TDevice>({
      url: `/api/projects/${projectId}/devices`,
      method: 'POST',
      data,
    });
  }

  getDetail(projectId: string, id: string) {
    return httpService.request<TDevice>({
      url: `/api/projects/${projectId}/devices/${id}`,
      method: 'GET',
    });
  }

  update(projectId: string, id: string, data: TCreateDeviceDto) {
    return httpService.request<TDevice>({
      url: `/api/projects/${projectId}/devices/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(projectId: string, id: string) {
    return httpService.request<void>({
      url: `/api/projects/${projectId}/devices/${id}`,
      method: 'DELETE',
    });
  }

  uploadImage(projectId: string, id: string, file: Blob) {
    return httpService.request<TDevice>({
      url: `/api/projects/${projectId}/devices/${id}/images`,
      method: 'PATCH',
      contentType: 'multipart/form-data',
      data: {
        file,
      },
    });
  }
}

export default new DeviceService();
