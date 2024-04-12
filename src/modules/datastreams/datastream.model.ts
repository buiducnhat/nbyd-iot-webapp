import { TDevice } from '../devices/device.model';

export enum EDatastreamType {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG',
  VIRTUAL = 'VIRTUAL',
  ZIGBEE = 'ZIGBEE',
}

export const EDatastreamTypeOptions = [
  { value: EDatastreamType.DIGITAL, label: 'Digital' },
  { value: EDatastreamType.ANALOG, label: 'Analog' },
  { value: EDatastreamType.VIRTUAL, label: 'Virtual' },
  { value: EDatastreamType.ZIGBEE, label: 'Zigbee' },
];

export enum EDatastreamMode {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  INPUT_PULLUP = 'INPUT_PULLUP',
  INPUT_PULLDOWN = 'INPUT_PULLDOWN',
}

export const EDatastreamModeOptions = [
  { value: EDatastreamMode.INPUT, label: 'Input' },
  { value: EDatastreamMode.OUTPUT, label: 'Output' },
  { value: EDatastreamMode.INPUT_PULLUP, label: 'Input Pullup' },
  { value: EDatastreamMode.INPUT_PULLDOWN, label: 'Input Pulldown' },
];

export enum EDatastreamDataType {
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
}

export const EDatastreamDataTypeOptions = [
  { value: EDatastreamDataType.INTEGER, label: 'Integer' },
  { value: EDatastreamDataType.FLOAT, label: 'Float' },
  { value: EDatastreamDataType.STRING, label: 'String' },
];

export type TDatastream = {
  id: string;
  deviceId: string;
  name: string;
  iconId: number;
  color: string;
  type: EDatastreamType;
  mac?: string;
  pin?: string;
  mode?: EDatastreamMode;
  dataType?: EDatastreamDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabledHistory: boolean;
  lastValue: string;
  createdAt: string;
  updatedAt: string;
  values: {
    datastreamId: string;
    value: string;
    createdAt: string;
  }[];
  device?: TDevice;
};
