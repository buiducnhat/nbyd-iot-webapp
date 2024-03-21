import React from 'react';
import RGL from 'react-grid-layout';

import { TDatastream } from '@/modules/datastreams/datastream.model';
import { TFormField } from '@/shared/types/form-field';

import InputNumberWidget from './input-number';
import SliderWidget from './slider';
import SwitchWidget from './switch';
import ValueBoxWidget from './value-box';

export type TWidgetType = 'SWITCH' | 'VALUE_BOX' | 'SLIDER' | 'INPUT_NUMBER';

export type TWidgetProps<TProperties = any, TValue = any> = {
  value?: TValue;
  onChange?: (value: TValue) => void;
  properties?: TProperties;
  datastream?: TDatastream;
};

export type TWidgetCommon = {
  Widget: React.FC<TWidgetProps>;
  type: TWidgetType;
  layoutSettings: RGL.Layout;
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
    propertiesFields: [],
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
    propertiesFields: [],
    defaultProperties: {
      value: 0,
    },
  },
};
