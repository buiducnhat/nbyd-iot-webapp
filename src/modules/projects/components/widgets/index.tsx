import React from 'react';
import RGL from 'react-grid-layout';

import InputNumberWidget from './input-number-widget';
import SwitchWidget from './switch-widget';
import SliderWidget from './switch/slider-widget';
import ValueBoxWidget from './value-box-widget';

export type TWidgetType = 'SWITCH' | 'VALUE_BOX' | 'SLIDER' | 'INPUT_NUMBER';

export type TWidgetProps = {
  title?: string;
  properties?: any;
};

export type TWidgetCommon = {
  Widget: React.FC<TWidgetProps>;
  type: TWidgetType;
  layout: RGL.Layout;
  properties?: any;
};

export type TDashboardItem = {
  title: string;
  type: TWidgetType;
  layout: RGL.Layout;
  properties?: any;
};

export const listWidgetCommon: TWidgetCommon[] = [
  {
    Widget: SwitchWidget,
    type: 'SWITCH',
    layout: {
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
  },
  {
    Widget: ValueBoxWidget,
    type: 'VALUE_BOX',
    layout: {
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
  },
  {
    Widget: SliderWidget,
    type: 'SLIDER',
    layout: {
      i: 'SLIDER',
      w: 5,
      h: 1,
      x: 0,
      y: 0,
      minW: 5,
      maxW: 8,
      minH: 1,
      maxH: 2,
    },
  },
  {
    Widget: InputNumberWidget,
    type: 'INPUT_NUMBER',
    layout: {
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
  },
];
