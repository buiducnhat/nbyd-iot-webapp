import { TGateway } from '../gateways/gateway.model';

export enum EDeviceType {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG',
  VIRTUAL = 'VIRTUAL',
  ZIGBEE = 'ZIGBEE',
}

export const EDeviceTypeOptions = [
  { value: EDeviceType.DIGITAL, label: 'Digital' },
  { value: EDeviceType.ANALOG, label: 'Analog' },
  { value: EDeviceType.VIRTUAL, label: 'Virtual' },
  { value: EDeviceType.ZIGBEE, label: 'Zigbee' },
];

export enum EDeviceMode {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  INPUT_PULLUP = 'INPUT_PULLUP',
  INPUT_PULLDOWN = 'INPUT_PULLDOWN',
}

export const EDeviceModeOptions = [
  { value: EDeviceMode.INPUT, label: 'Input' },
  { value: EDeviceMode.OUTPUT, label: 'Output' },
  { value: EDeviceMode.INPUT_PULLUP, label: 'Input Pullup' },
  { value: EDeviceMode.INPUT_PULLDOWN, label: 'Input Pulldown' },
];

export enum EDeviceDataType {
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
}

export const EDeviceDataTypeOptions = [
  { value: EDeviceDataType.INTEGER, label: 'Integer' },
  { value: EDeviceDataType.FLOAT, label: 'Float' },
  { value: EDeviceDataType.STRING, label: 'String' },
];

export type TDevice = {
  id: string;
  gatewayId: string;
  name: string;
  iconId: number;
  color: string;
  type: EDeviceType;
  mac?: string;
  pin?: string;
  mode?: EDeviceMode;
  dataType?: EDeviceDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabledHistory: boolean;
  lastValue: string;
  createdAt: string;
  updatedAt: string;
  values: {
    deviceId: string;
    value: string;
    createdAt: string;
  }[];
  gateway?: TGateway;
};
