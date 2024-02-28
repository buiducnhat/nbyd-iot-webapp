import httpService from '@/shared/http-service';

import { TCreateProjectDto } from './dto/create-project.dto';
import { TGetListProjectDto } from './dto/get-list-project.dto';
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
}

export default new ProjectService();
