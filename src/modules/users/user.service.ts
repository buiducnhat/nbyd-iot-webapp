import httpService from '@/shared/http-service';

import { TUpdateUserDto } from './dto/update-user.dto';
import { TUser } from './user.model';

class UserService {
  updateMe(input: TUpdateUserDto) {
    return httpService.request<TUser>({
      url: '/api/users/me',
      method: 'PATCH',
      data: input,
    });
  }

  changeAvatar(file: Blob) {
    return httpService.request<TUser>({
      url: '/api/users/avatar',
      method: 'PATCH',
      contentType: 'multipart/form-data',
      data: {
        file,
      },
    });
  }
}

export default new UserService();
