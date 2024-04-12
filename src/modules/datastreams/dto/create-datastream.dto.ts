import {
  EDatastreamDataType,
  EDatastreamMode,
  EDatastreamType,
} from '../datastream.model';

export type TCreateDatastreamDto = {
  name: string;
  mac?: string;
  iconId?: number;
  color?: string;
  type: EDatastreamType;
  mode?: EDatastreamMode;
  pin?: string;
  dataType?: EDatastreamDataType;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  unit?: string;
  enabledHistory?: boolean;
};
