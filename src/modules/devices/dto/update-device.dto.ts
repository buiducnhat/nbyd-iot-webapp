import { EDeviceDataType, EDeviceMode } from '../device.model';

export type TUpdateDeviceDto = {
  name?: string;
  iconId?: number;
  color?: string;
  mode?: EDeviceMode;
  pin?: string;
  dataType?: EDeviceDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabledHistory?: boolean;
};
