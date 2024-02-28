import { TFileBasicDto } from '../files/file.model';

export enum EDeviceHardware {
  ESP32 = 'ESP32',
  ESP8266 = 'ESP8266',
}

export enum EDeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export type TDeviceBasic = {
  id: string;
  name: string;
  imageFile: TFileBasicDto;
  authToken: string;
  hardware: EDeviceHardware;
  status: EDeviceStatus;
  lastOnlineAt?: string | Date;
  createdAt: string | Date;
};
