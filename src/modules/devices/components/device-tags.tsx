import { Tag } from 'antd';

import { EDeviceDataType, EDeviceMode, EDeviceType } from '../device.model';

export const DeviceTypeTag = ({ type }: { type: EDeviceType }) => {
  const typeColorMap = {
    [EDeviceType.DIGITAL]: 'blue',
    [EDeviceType.ANALOG]: 'purple',
    [EDeviceType.VIRTUAL]: 'green',
    [EDeviceType.ZIGBEE]: 'red',
  };

  return <Tag color={typeColorMap[type]}>{type}</Tag>;
};

export const DeviceModeTag = ({ mode }: { mode: EDeviceMode }) => {
  const modeColorMap = {
    [EDeviceMode.INPUT]: 'green',
    [EDeviceMode.OUTPUT]: 'geekblue',
    [EDeviceMode.INPUT_PULLUP]: 'gold',
    [EDeviceMode.INPUT_PULLDOWN]: 'purple',
  };

  return <Tag color={modeColorMap[mode]}>{mode}</Tag>;
};

export const DeviceDataTypeTag = ({
  dataType,
}: {
  dataType: EDeviceDataType;
}) => {
  const dataTypeColorMap = {
    [EDeviceDataType.INTEGER]: 'volcano',
    [EDeviceDataType.FLOAT]: 'gold',
    [EDeviceDataType.STRING]: 'cyan',
  };

  return <Tag color={dataTypeColorMap[dataType]}>{dataType}</Tag>;
};
