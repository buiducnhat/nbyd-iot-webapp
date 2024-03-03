import { EDeviceConnection, EDeviceHardware } from '../device.model';

export type TCreateDeviceDto = {
  name: string;
  description?: string;
  hardware: EDeviceHardware;
  connection: EDeviceConnection;
};

export type TUpdateDeviceDto = {
  name?: string;
  description?: string;
};
