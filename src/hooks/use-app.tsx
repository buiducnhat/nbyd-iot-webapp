import { theme } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/modules/app/app.zustand';

function useApp() {
  const { t } = useTranslation();

  const gTheme = useAppStore((state) => state.theme);
  const isDarkTheme = gTheme.algorithm.includes(theme.darkAlgorithm);
  const { token } = theme.useToken();

  return {
    t,
    isDarkTheme,
    token,
  };
}

export default useApp;
