export enum EZDevicePin {
  DOOR_SENSOR = 'DOOR_SENSOR',
  MOTION_SENSOR = 'MOTION_SENSOR',
  TH_SENSOR = 'TH_SENSOR',

  SWITCH_1G = 'SWITCH_1G',
  SWITCH_2G = 'SWITCH_2G',
  SWITCH_3G = 'SWITCH_3G',
}

export const Z_DEVICE_PIN_OPTIONS = [
  { label: 'DOOR_SENSOR', value: EZDevicePin.DOOR_SENSOR.toString() },
  { label: 'MOTION_SENSOR', value: EZDevicePin.MOTION_SENSOR.toString() },
  {
    label: 'TH_SENSOR',
    value: EZDevicePin.TH_SENSOR.toString(),
  },
  { label: 'SWITCH_1G', value: EZDevicePin.SWITCH_1G.toString() },
  { label: 'SWITCH_2G', value: EZDevicePin.SWITCH_2G.toString() },
  { label: 'SWITCH_3G', value: EZDevicePin.SWITCH_3G.toString() },
];
