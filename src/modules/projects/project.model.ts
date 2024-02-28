import { TDeviceBasic } from '../devices/device.model';
import { TFileBasicDto } from '../files/file.model';

export enum EProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type TProjectBasic = {
  id: string;
  name: string;
  description?: string;
  status: EProjectStatus;
  imageFile: TFileBasicDto;
  _count: {
    devices: number;
  };
  createdAt: string;
};

export type TProjectDetail = TProjectBasic & {
  devices: TDeviceBasic[];
  metaData?: any;
  webDashboard?: any;
  mobileDashboard?: any;
  updatedAt: string;
};
