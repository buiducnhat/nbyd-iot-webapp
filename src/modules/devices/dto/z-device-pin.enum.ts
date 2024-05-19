export enum EZDevicePin {
  DOOR_SENSOR = 'DOOR_SENSOR',
  MOTION_SENSOR = 'MOTION_SENSOR',
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  TEMP_HUMI_SENSOR = 'TEMP_HUMI_SENSOR',
  LIGHT_SENSOR = 'LIGHT_SENSOR',
  SMOKE_SENSOR = 'SMOKE_SENSOR',

  SWITCH_1G = 'SWITCH_1G',
  SWITCH_2G = 'SWITCH_2G',
  SWITCH_3G = 'SWITCH_3G',

  SOCKET_1G = 'SOCKET_1G',
  SOCKET_2G = 'SOCKET_2G',
  SOCKET_3G = 'SOCKET_3G',

  DIMMER_1G = 'DIMMER_1G',
  DIMMER_2G = 'DIMMER_2G',
}

export const Z_DEVICE_PIN_OPTIONS = [
  { label: 'DOOR_SENSOR', value: EZDevicePin.DOOR_SENSOR.toString() },
  { label: 'MOTION_SENSOR', value: EZDevicePin.MOTION_SENSOR.toString() },
  {
    label: 'TEMPERATURE_SENSOR',
    value: EZDevicePin.TEMPERATURE_SENSOR.toString(),
  },
  {
    label: 'HUMIDITY_SENSOR',
    value: EZDevicePin.HUMIDITY_SENSOR.toString(),
  },
  {
    label: 'TEMP_HUMI_SENSOR',
    value: EZDevicePin.TEMP_HUMI_SENSOR.toString(),
  },
  { label: 'LIGHT_SENSOR', value: EZDevicePin.LIGHT_SENSOR.toString() },
  { label: 'SMOKE_SENSOR', value: EZDevicePin.SMOKE_SENSOR.toString() },
  { label: 'SWITCH_1G', value: EZDevicePin.SWITCH_1G.toString() },
  { label: 'SWITCH_2G', value: EZDevicePin.SWITCH_2G.toString() },
  { label: 'SWITCH_3G', value: EZDevicePin.SWITCH_3G.toString() },
  { label: 'SOCKET_1G', value: EZDevicePin.SOCKET_1G.toString() },
  { label: 'SOCKET_2G', value: EZDevicePin.SOCKET_2G.toString() },
  { label: 'SOCKET_3G', value: EZDevicePin.SOCKET_3G.toString() },
  { label: 'DIMMER_1G', value: EZDevicePin.DIMMER_1G.toString() },
  { label: 'DIMMER_2G', value: EZDevicePin.DIMMER_2G.toString() },
];
