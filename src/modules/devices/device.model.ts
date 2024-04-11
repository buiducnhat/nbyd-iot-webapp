import { TDatastream } from '../datastreams/datastream.model';

export enum EDeviceHardware {
  ESP32 = 'ESP32',
  ESP8266 = 'ESP8266',
  RASPBERRY_PI = 'RASPBERRY_PI',
}

export const EDeviceHardwareOptions = [
  { label: 'ESP32', value: EDeviceHardware.ESP32 },
  { label: 'ESP8266', value: EDeviceHardware.ESP8266 },
  { label: 'RASPBERRY PI', value: EDeviceHardware.RASPBERRY_PI },
];

export enum EDeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EDeviceConnection {
  WIFI = 'WIFI',
}

export const EDeviceConnectionOptions = [
  { label: 'Wifi', value: EDeviceConnection.WIFI },
];

export type TDevice = {
  id: string;
  name: string;
  imageFileId?: string;
  imageFileUrl?: string;
  authToken: string;
  hardware: EDeviceHardware;
  connection: EDeviceConnection;
  status: EDeviceStatus;
  lastOnlineAt?: string | Date;
  description?: string;
  createdAt: string | Date;
  datastreams: TDatastream[];
  metaData: Record<string, any>;
};
