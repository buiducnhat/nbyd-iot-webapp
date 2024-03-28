import { EDatastreamDataType, EDatastreamMode } from '../datastream.model';

export type TUpdateDatastreamDto = {
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
