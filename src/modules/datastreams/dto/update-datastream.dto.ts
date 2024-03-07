import { EDatastreamDataType, EDatastreamMode } from '../datastream.model';

export type UpdateDatastreamDto = {
  name?: string;
  iconId?: number;
  color?: string;
  mode?: EDatastreamMode;
  pin?: string;
  dataType?: EDatastreamDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabledHistory?: boolean;
};
