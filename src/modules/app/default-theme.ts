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
    boxShadowSecondary:
      '0px 2px 16px 0px rgba(0,0,0,0.06),0px 0px 4px -4px rgba(0,0,0,0.08),0px 0px 12px 4px rgba(0,0,0,0.03)',

    fontFamily: 'Noto Sans Display, sans-serif',
    fontFamilyCode: 'Chivo Mono, monospace',
  },
  algorithm: [theme.defaultAlgorithm],
};
