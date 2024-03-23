import { theme } from 'antd';

import { TTheme } from './app.zustand';

export const defaultTheme: TTheme = {
  token: {
    fontFamily: 'Noto Sans Display, sans-serif',
    fontFamilyCode: 'Chivo Mono, monospace',
  },
  algorithm: [theme.defaultAlgorithm],
};
