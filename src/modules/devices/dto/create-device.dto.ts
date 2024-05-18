import { EDeviceDataType, EDeviceMode, EDeviceType } from '../device.model';

export type TCreateDeviceDto = {
  name: string;
  iconId?: number;
  color?: string;
  type: EDeviceType;
  mode?: EDeviceMode;
  pin?: string;
  dataType?: EDeviceDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabledHistory?: boolean;
};
