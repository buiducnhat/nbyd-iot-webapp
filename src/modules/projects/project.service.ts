import httpService from '@/shared/http-service';

import { TDevice } from '../devices/device.model';
import { TCreateProjectDto } from './dto/create-project.dto';
import { TGetListProjectDto } from './dto/get-list-project.dto';
import { TUpdateDashboardDto } from './dto/update-project-web-dashboard.dto';
import { TProjectBasic, TProjectDetail } from './project.model';

class ProjectService {
  getList(input: TGetListProjectDto) {
    return httpService.request<TProjectBasic[]>({
      url: '/api/projects',
      method: 'GET',
      params: input,
    });
  }

  getDetail(id: string) {
    return httpService.request<TProjectDetail>({
      url: `/api/projects/${id}`,
      method: 'GET',
    });
  }

  getListDevice(id: string, historyFrom?: Date, historyTo?: Date) {
    return httpService.request<TDevice[]>({
      url: `/api/projects/${id}/devices`,
      method: 'GET',
      params: {
        historyFrom: historyFrom ? historyFrom.getTime() : undefined,
        historyTo: historyTo ? historyTo.getTime() : undefined,
      },
    });
  }

  create(data: TCreateProjectDto) {
    return httpService.request<TProjectBasic>({
      url: '/api/projects',
      method: 'POST',
      data,
    });
  }

  update(id: string, data: TCreateProjectDto) {
    return httpService.request<TProjectBasic>({
      url: `/api/projects/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(id: string) {
    return httpService.request<void>({
      url: `/api/projects/${id}`,
      method: 'DELETE',
    });
  }

  updateDashboard(id: string, data: TUpdateDashboardDto) {
    return httpService.request<TProjectBasic>({
      url: `/api/projects/${id}/dashboard`,
      method: 'PATCH',
      data,
    });
  }

  uploadImage(id: string, file: Blob) {
    return httpService.request<TProjectBasic>({
      url: `/api/projects/${id}/images`,
      method: 'PATCH',
      contentType: 'multipart/form-data',
      data: {
        file,
      },
    });
  }
}

export default new ProjectService();
