export enum ZDatastreamPin {
  DOOR_SENSOR,
  MOTION_SENSOR,
  TEMPERATURE_SENSOR,
  HUMIDITY_SENSOR,
  TEMP_HUMI_SENSOR,
  LIGHT_SENSOR,
  SMOKE_SENSOR,

  SWITCH_1G,
  SWITCH_2G,
  SWITCH_3G,

  SOCKET_1G,
  SOCKET_2G,
  SOCKET_3G,

  DIMMER_1G,
  DIMMER_2G,
}

export const Z_DATASTREAM_PIN_OPTIONS = [
  { label: 'DOOR_SENSOR', value: ZDatastreamPin.DOOR_SENSOR.toString() },
  { label: 'MOTION_SENSOR', value: ZDatastreamPin.MOTION_SENSOR.toString() },
  {
    label: 'TEMPERATURE_SENSOR',
    value: ZDatastreamPin.TEMPERATURE_SENSOR.toString(),
  },
  {
    label: 'HUMIDITY_SENSOR',
    value: ZDatastreamPin.HUMIDITY_SENSOR.toString(),
  },
  {
    label: 'TEMP_HUMI_SENSOR',
    value: ZDatastreamPin.TEMP_HUMI_SENSOR.toString(),
  },
  { label: 'LIGHT_SENSOR', value: ZDatastreamPin.LIGHT_SENSOR.toString() },
  { label: 'SMOKE_SENSOR', value: ZDatastreamPin.SMOKE_SENSOR.toString() },
  { label: 'SWITCH_1G', value: ZDatastreamPin.SWITCH_1G.toString() },
  { label: 'SWITCH_2G', value: ZDatastreamPin.SWITCH_2G.toString() },
  { label: 'SWITCH_3G', value: ZDatastreamPin.SWITCH_3G.toString() },
  { label: 'SOCKET_1G', value: ZDatastreamPin.SOCKET_1G.toString() },
  { label: 'SOCKET_2G', value: ZDatastreamPin.SOCKET_2G.toString() },
  { label: 'SOCKET_3G', value: ZDatastreamPin.SOCKET_3G.toString() },
  { label: 'DIMMER_1G', value: ZDatastreamPin.DIMMER_1G.toString() },
  { label: 'DIMMER_2G', value: ZDatastreamPin.DIMMER_2G.toString() },
];
