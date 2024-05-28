import { useMedia } from 'react-use';

import useApp from './use-app';

const useDeviceSize = () => {
  const { token } = useApp();

  const isMobile = useMedia(`(max-width: ${token.screenSMMax}px)`);
  const isTablet = useMedia(`(min-width: ${token.screenMD}px)`);
  const isDesktop = useMedia(`(min-width: ${token.screenLG}px)`);

  return { isMobile, isTablet, isDesktop };
};

export default useDeviceSize;
