import { theme } from 'antd';

import { TTheme } from './app.zustand';

export const defaultTheme: TTheme = {
  token: {
    colorPrimary: '#2980b9',
    colorInfo: '#3498db',
    colorSuccess: '#27ae60',
    colorWarning: '#f39c12',
    colorError: '#c0392b',
    colorLink: '#3498db',
    borderRadius: 0,

    fontFamily: 'Noto Sans Display, sans-serif',
    fontFamilyCode: 'Chivo Mono, monospace',
  },
  algorithm: [theme.defaultAlgorithm],
};
