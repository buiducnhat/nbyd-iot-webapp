import httpService from '@/shared/http-service';

import { TCreateGatewayDto } from './dto/create-gateway.dto';
import { TGateway } from './gateway.model';

class GatewayService {
  create(projectId: string, data: TCreateGatewayDto) {
    return httpService.request<TGateway>({
      url: `/api/projects/${projectId}/gateways`,
      method: 'POST',
      data,
    });
  }

  getDetail(projectId: string, id: string) {
    return httpService.request<TGateway>({
      url: `/api/projects/${projectId}/gateways/${id}`,
      method: 'GET',
    });
  }

  update(projectId: string, id: string, data: TCreateGatewayDto) {
    return httpService.request<TGateway>({
      url: `/api/projects/${projectId}/gateways/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(projectId: string, id: string) {
    return httpService.request<void>({
      url: `/api/projects/${projectId}/gateways/${id}`,
      method: 'DELETE',
    });
  }

  uploadImage(projectId: string, id: string, file: Blob) {
    return httpService.request<TGateway>({
      url: `/api/projects/${projectId}/gateways/${id}/images`,
      method: 'PATCH',
      contentType: 'multipart/form-data',
      data: {
        file,
      },
    });
  }
}

export default new GatewayService();
