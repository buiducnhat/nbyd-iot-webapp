import { TDevice } from '../devices/device.model';

export enum EGatewayHardware {
  ESP32 = 'ESP32',
  ESP8266 = 'ESP8266',
  RASPBERRY_PI = 'RASPBERRY_PI',
}

export const EGatewayHardwareOptions = [
  { label: 'ESP32', value: EGatewayHardware.ESP32 },
  { label: 'ESP8266', value: EGatewayHardware.ESP8266 },
  { label: 'RASPBERRY PI', value: EGatewayHardware.RASPBERRY_PI },
];

export enum EGatewayStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EGatewayConnection {
  WIFI = 'WIFI',
}

export const EGatewayConnectionOptions = [
  { label: 'Wifi', value: EGatewayConnection.WIFI },
];

export type TGateway = {
  id: string;
  name: string;
  imageFileId?: string;
  imageFileUrl?: string;
  authToken: string;
  hardware: EGatewayHardware;
  connection: EGatewayConnection;
  status: EGatewayStatus;
  lastOnlineAt?: string | Date;
  description?: string;
  createdAt: string | Date;
  devices: TDevice[];
  metaData: Record<string, any>;
};
