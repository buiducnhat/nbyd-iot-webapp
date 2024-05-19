import React from 'react';
import RGL from 'react-grid-layout';

import { TDevice } from '@/modules/devices/device.model';
import { TFormField } from '@/shared/types/form-field';

import DoorContact from './door-contact';
import InputNumberWidget from './input-number';
import InputTextWidget from './input-text';
import LedWidget from './led';
import SliderWidget from './slider';
import SwitchWidget from './switch';
import Switch1G from './switch-1g';
import Switch2G from './switch-2g';
import Switch3G from './switch-3g';
import ValueBoxWidget from './value-box';

export type TWidgetType =
  | 'SWITCH'
  | 'VALUE_BOX'
  | 'LED'
  | 'SLIDER'
  | 'INPUT_NUMBER'
  | 'INPUT_TEXT'
  | 'DOOR_SENSOR'
  | 'SWITCH_1G'
  | 'SWITCH_2G'
  | 'SWITCH_3G';

export type TWidgetProps<TProperties = any, TValue = any> = {
  value?: TValue;
  onChange?: (value?: TValue) => void;
  properties?: TProperties;
  defaultProperties?: TProperties;
  device?: TDevice;
};

export type TValidDeviceType =
  | 'DIGITAL_INPUT_INTEGER'
  | 'DIGITAL_OUTPUT_INTEGER'
  | 'ANALOG_INPUT_INTEGER'
  | 'ANALOG_OUTPUT_INTEGER'
  | 'VIRTUAL__INTEGER'
  | 'VIRTUAL__FLOAT'
  | 'VIRTUAL__STRING'
  | 'ZIGBEE__DOOR_SENSOR'
  | 'ZIGBEE__TEMPERATURE'
  | 'ZIGBEE__HUMIDITY'
  | 'ZIGBEE__SWITCH_1G'
  | 'ZIGBEE__SWITCH_2G'
  | 'ZIGBEE__SWITCH_3G';

export type TWidgetCommon = {
  Widget: React.FC<TWidgetProps>;
  type: TWidgetType;
  layoutSettings: RGL.Layout;
  validDeviceTypes: Array<TValidDeviceType>;
  properties?: any;
  propertiesFields: TFormField[];
  defaultProperties?: any;
};

export type TDashboardItem = {
  type: TWidgetType;
  layout: RGL.Layout;
  properties?: any;
};

export const FULL_ATTRIBUTES_WIDGETS: Record<TWidgetType, TWidgetCommon> = {
  SWITCH: {
    type: 'SWITCH',
    Widget: SwitchWidget,
    layoutSettings: {
      i: 'SWITCH',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: ['DIGITAL_OUTPUT_INTEGER', 'VIRTUAL__INTEGER'],
    propertiesFields: [
      { label: 'Color', name: 'color', type: 'color-picker' },
      {
        name: 'onValue',
        label: 'On value',
        type: 'input-number',
        required: true,
      },
      {
        name: 'offValue',
        label: 'Off value',
        type: 'input-number',
        required: true,
      },
      { name: 'onTitle', label: 'On title', type: 'input' },
      { name: 'offTitle', label: 'Off title', type: 'input' },
    ],
    defaultProperties: {
      value: 0,
      onValue: 1,
      offValue: 0,
    },
  },
  VALUE_BOX: {
    type: 'VALUE_BOX',
    Widget: ValueBoxWidget,
    layoutSettings: {
      i: 'VALUE_BOX',
      w: 3,
      h: 1,
      x: 0,
      y: 0,
      minW: 3,
      maxW: 4,
      minH: 1,
      maxH: 2,
    },
    validDeviceTypes: [
      'DIGITAL_INPUT_INTEGER',
      'DIGITAL_OUTPUT_INTEGER',
      'ANALOG_INPUT_INTEGER',
      'ANALOG_OUTPUT_INTEGER',
      'VIRTUAL__INTEGER',
      'VIRTUAL__FLOAT',
      'VIRTUAL__STRING',
    ],
    propertiesFields: [
      { name: 'decimalPlaces', label: 'Decimal places', type: 'input-number' },
    ],
    defaultProperties: {
      value: '0',
      unit: '',
      decimalPlaces: 4,
    },
  },
  LED: {
    type: 'LED',
    Widget: LedWidget,
    layoutSettings: {
      i: 'LED',
      w: 2,
      h: 1,
      x: 0,
      y: 0,
      minW: 2,
      maxW: 4,
      minH: 1,
      maxH: 2,
    },
    validDeviceTypes: [
      'DIGITAL_INPUT_INTEGER',
      'DIGITAL_OUTPUT_INTEGER',
      'ANALOG_INPUT_INTEGER',
      'ANALOG_OUTPUT_INTEGER',
      'VIRTUAL__INTEGER',
      'VIRTUAL__FLOAT',
      'VIRTUAL__STRING',
    ],
    propertiesFields: [{ label: 'Color', name: 'color', type: 'color-picker' }],
    defaultProperties: {
      value: 0,
    },
  },
  SLIDER: {
    type: 'SLIDER',
    Widget: SliderWidget,
    layoutSettings: {
      i: 'SLIDER',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: [
      'DIGITAL_OUTPUT_INTEGER',
      'ANALOG_OUTPUT_INTEGER',
      'VIRTUAL__INTEGER',
    ],
    propertiesFields: [
      { label: 'Color', name: 'color', type: 'color-picker' },
      { name: 'step', label: 'Step', type: 'input-number', required: true },
    ],
    defaultProperties: {
      value: 0,
      min: 0,
      max: 100,
      step: 1,
    },
  },
  INPUT_NUMBER: {
    type: 'INPUT_NUMBER',
    Widget: InputNumberWidget,
    layoutSettings: {
      i: 'INPUT_NUMBER',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: [
      'DIGITAL_OUTPUT_INTEGER',
      'ANALOG_OUTPUT_INTEGER',
      'VIRTUAL__INTEGER',
      'VIRTUAL__FLOAT',
    ],
    propertiesFields: [],
    defaultProperties: {
      value: 0,
    },
  },
  INPUT_TEXT: {
    type: 'INPUT_TEXT',
    Widget: InputTextWidget,
    layoutSettings: {
      i: 'INPUT_TEXT',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: ['VIRTUAL__STRING'],
    propertiesFields: [],
    defaultProperties: {
      value: '',
    },
  },
  DOOR_SENSOR: {
    type: 'DOOR_SENSOR',
    Widget: DoorContact,
    layoutSettings: {
      i: 'DOOR_SENSOR',
      w: 3,
      h: 1,
      x: 0,
      y: 0,
      minW: 3,
      maxW: 5,
      minH: 1,
      maxH: 2,
    },
    validDeviceTypes: ['ZIGBEE__DOOR_SENSOR'],
    propertiesFields: [{ label: 'Color', name: 'color', type: 'color-picker' }],
    defaultProperties: {
      value: {
        contact: true,
      },
    },
  },
  SWITCH_1G: {
    Widget: Switch1G,
    type: 'SWITCH_1G',
    layoutSettings: {
      i: 'SWITCH_1G',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: ['ZIGBEE__SWITCH_1G'],
    propertiesFields: [{ label: 'Color', name: 'color', type: 'color-picker' }],
    defaultProperties: {
      value: {
        state: 'OFF',
      },
    },
  },
  SWITCH_2G: {
    Widget: Switch2G,
    type: 'SWITCH_2G',
    layoutSettings: {
      i: 'SWITCH_2G',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: ['ZIGBEE__SWITCH_2G'],
    propertiesFields: [{ label: 'Color', name: 'color', type: 'color-picker' }],
    defaultProperties: {
      value: {
        state1: 'OFF',
        state2: 'OFF',
      },
    },
  },
  SWITCH_3G: {
    Widget: Switch3G,
    type: 'SWITCH_3G',
    layoutSettings: {
      i: 'SWITCH_3G',
      w: 4,
      h: 1,
      x: 0,
      y: 0,
      minW: 4,
      maxW: 6,
      minH: 1,
      maxH: 1,
    },
    validDeviceTypes: ['ZIGBEE__SWITCH_3G'],
    propertiesFields: [{ label: 'Color', name: 'color', type: 'color-picker' }],
    defaultProperties: {
      value: {
        state1: 'OFF',
        state2: 'OFF',
        state3: 'OFF',
      },
    },
  },
};
