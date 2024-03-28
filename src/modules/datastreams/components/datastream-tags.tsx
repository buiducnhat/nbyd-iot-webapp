import { Tag } from 'antd';

import {
  EDatastreamDataType,
  EDatastreamMode,
  EDatastreamType,
} from '../datastream.model';

export const DatastreamTypeTag = ({ type }: { type: EDatastreamType }) => {
  const typeColorMap = {
    [EDatastreamType.DIGITAL]: 'blue',
    [EDatastreamType.ANALOG]: 'purple',
    [EDatastreamType.VIRTUAL]: 'green',
    [EDatastreamType.ZIGBEE]: 'red',
  };

  return <Tag color={typeColorMap[type]}>{type}</Tag>;
};

export const DatastreamModeTag = ({ mode }: { mode: EDatastreamMode }) => {
  const modeColorMap = {
    [EDatastreamMode.INPUT]: 'green',
    [EDatastreamMode.OUTPUT]: 'geekblue',
    [EDatastreamMode.INPUT_PULLUP]: 'gold',
    [EDatastreamMode.INPUT_PULLDOWN]: 'purple',
  };

  return <Tag color={modeColorMap[mode]}>{mode}</Tag>;
};

export const DatastreamDataTypeTag = ({
  dataType,
}: {
  dataType: EDatastreamDataType;
}) => {
  const dataTypeColorMap = {
    [EDatastreamDataType.INTEGER]: 'volcano',
    [EDatastreamDataType.FLOAT]: 'gold',
    [EDatastreamDataType.STRING]: 'cyan',
  };

  return <Tag color={dataTypeColorMap[dataType]}>{dataType}</Tag>;
};
