import React from 'react';
import RGL from 'react-grid-layout';

import { TDatastream } from '@/modules/datastreams/datastream.model';
import { TFormField } from '@/shared/types/form-field';

import InputNumberWidget from './input-number';
import InputTextWidget from './input-text';
import LedWidget from './led';
import SliderWidget from './slider';
import SwitchWidget from './switch';
import ValueBoxWidget from './value-box';

export type TWidgetType =
  | 'SWITCH'
  | 'VALUE_BOX'
  | 'LED'
  | 'SLIDER'
  | 'INPUT_NUMBER'
  | 'INPUT_TEXT';

export type TWidgetProps<TProperties = any, TValue = any> = {
  value?: TValue;
  onChange?: (value?: TValue) => void;
  properties?: TProperties;
  defaultProperties?: TProperties;
  datastream?: TDatastream;
};

export type TValidDatastreamType =
  | 'DIGITAL_INPUT'
  | 'DIGITAL_OUTPUT'
  | 'ANALOG_INPUT'
  | 'ANALOG_OUTPUT'
  | 'VIRTUAL_INTEGER'
  | 'VIRTUAL_FLOAT'
  | 'VIRTUAL_STRING';

export type TWidgetCommon = {
  Widget: React.FC<TWidgetProps>;
  type: TWidgetType;
  layoutSettings: RGL.Layout;
  validDatastreamTypes: Array<TValidDatastreamType>;
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
      maxH: 2,
    },
    validDatastreamTypes: ['DIGITAL_OUTPUT', 'VIRTUAL_INTEGER'],
    propertiesFields: [
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
    validDatastreamTypes: [
      'DIGITAL_INPUT',
      'DIGITAL_OUTPUT',
      'ANALOG_INPUT',
      'ANALOG_OUTPUT',
      'VIRTUAL_INTEGER',
      'VIRTUAL_FLOAT',
      'VIRTUAL_STRING',
    ],
    propertiesFields: [],
    defaultProperties: {
      value: '0',
      unit: '',
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
    validDatastreamTypes: [
      'DIGITAL_INPUT',
      'DIGITAL_OUTPUT',
      'ANALOG_INPUT',
      'ANALOG_OUTPUT',
      'VIRTUAL_INTEGER',
      'VIRTUAL_FLOAT',
      'VIRTUAL_STRING',
    ],
    propertiesFields: [
      { label: 'On color', name: 'onColor', type: 'color-picker' },
      { label: 'Off color', name: 'offColor', type: 'color-picker' },
    ],
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
      maxH: 2,
    },
    validDatastreamTypes: [
      'DIGITAL_OUTPUT',
      'ANALOG_OUTPUT',
      'VIRTUAL_INTEGER',
    ],
    propertiesFields: [
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
      maxH: 2,
    },
    validDatastreamTypes: [
      'DIGITAL_OUTPUT',
      'ANALOG_OUTPUT',
      'VIRTUAL_INTEGER',
      'VIRTUAL_FLOAT',
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
      maxH: 2,
    },
    validDatastreamTypes: ['VIRTUAL_STRING'],
    propertiesFields: [],
    defaultProperties: {
      value: '',
    },
  },
};
