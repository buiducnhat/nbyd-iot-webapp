export enum EDatastreamType {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG',
  VIRTUAL = 'VIRTUAL',
  ZIGBEE = 'ZIGBEE',
}

export enum EDatastreamMode {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  INPUT_PULLUP = 'INPUT_PULLUP',
  INPUT_PULLDOWN = 'INPUT_PULLDOWN',
}

export enum EDatastreamDataType {
  BOOLEAN = 'BOOLEAN',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
  JSON = 'JSON',
}

export type TDatastream = {
  id: string;
  deviceId: string;
  name: string;
  iconId: number;
  color: string;
  type: EDatastreamType;
  mode?: EDatastreamMode;
  dataType?: EDatastreamDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabled: boolean;
  enabledHistory: boolean;
  createdAt: string;
  updatedAt: string;
};
