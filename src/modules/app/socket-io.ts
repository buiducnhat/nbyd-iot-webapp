import { io } from 'socket.io-client';

import { WS_SERVER_BASE_URL } from '@/configs/constants';

export const socket = io(WS_SERVER_BASE_URL, {
  autoConnect: false,
});
