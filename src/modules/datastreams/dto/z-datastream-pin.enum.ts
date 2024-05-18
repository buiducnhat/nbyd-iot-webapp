export enum EZDatastreamPin {
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

export const Z_DATASTREAM_PIN_OPTIONS = [
  { label: 'DOOR_SENSOR', value: EZDatastreamPin.DOOR_SENSOR.toString() },
  { label: 'MOTION_SENSOR', value: EZDatastreamPin.MOTION_SENSOR.toString() },
  {
    label: 'TEMPERATURE_SENSOR',
    value: EZDatastreamPin.TEMPERATURE_SENSOR.toString(),
  },
  {
    label: 'HUMIDITY_SENSOR',
    value: EZDatastreamPin.HUMIDITY_SENSOR.toString(),
  },
  {
    label: 'TEMP_HUMI_SENSOR',
    value: EZDatastreamPin.TEMP_HUMI_SENSOR.toString(),
  },
  { label: 'LIGHT_SENSOR', value: EZDatastreamPin.LIGHT_SENSOR.toString() },
  { label: 'SMOKE_SENSOR', value: EZDatastreamPin.SMOKE_SENSOR.toString() },
  { label: 'SWITCH_1G', value: EZDatastreamPin.SWITCH_1G.toString() },
  { label: 'SWITCH_2G', value: EZDatastreamPin.SWITCH_2G.toString() },
  { label: 'SWITCH_3G', value: EZDatastreamPin.SWITCH_3G.toString() },
  { label: 'SOCKET_1G', value: EZDatastreamPin.SOCKET_1G.toString() },
  { label: 'SOCKET_2G', value: EZDatastreamPin.SOCKET_2G.toString() },
  { label: 'SOCKET_3G', value: EZDatastreamPin.SOCKET_3G.toString() },
  { label: 'DIMMER_1G', value: EZDatastreamPin.DIMMER_1G.toString() },
  { label: 'DIMMER_2G', value: EZDatastreamPin.DIMMER_2G.toString() },
];
