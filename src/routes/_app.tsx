import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Image, Layout, Space, Spin } from 'antd';
import { onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';

import useApp from '@/hooks/use-app';
import { useAuth } from '@/hooks/use-auth';
import { useAppStore } from '@/modules/app/app.zustand';
import { socket } from '@/modules/app/socket-io';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import { messaging } from '@/modules/firebase';
import { EAppType } from '@/modules/firebase/dto/fcm-token.dto';
import firebaseService from '@/modules/firebase/firebase.service';
import { requestFcmPermission } from '@/modules/firebase/request-permission';
import MainSideNav from '@/shared/components/layouts/app/side-nav';
import MainTopBar from '@/shared/components/layouts/app/top-bar';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();

  const authQuery = useAuth();

  const { token, antdApp } = useApp();

  const accessToken = useAuthStore((state) => state.accessToken);
  const setConnectedSocket = useAppStore((state) => state.setConnectedSocket);

  const [collapsed, setCollapsed] = useState(false);

  // On message of fcm
  onMessage(messaging, (payload) => {
    antdApp.notification.open({
      message: payload.notification?.title,
      description: (
        <Space>
          {payload.notification?.body}
          <Image src={payload.notification?.image} width={64} />
        </Space>
      ),
      onClick: () => {},
    });
  });

  useEffect(() => {
    if (authQuery.isError) {
      navigate({ from: '/projects', to: '/auth/login' });
    }
  }, [authQuery.isError, navigate]);

  useEffect(() => {
    if (authQuery.isSuccess) {
      socket.auth = { token: accessToken };
      socket.connect();

      socket.on('connect', () => setConnectedSocket(true));
      socket.on('disconnect', () => setConnectedSocket(false));

      return () => {
        socket.disconnect();
        socket.off('connect', () => setConnectedSocket(true));
        socket.off('disconnect', () => setConnectedSocket(false));
      };
    }
  }, [accessToken, authQuery.isSuccess, navigate, setConnectedSocket]);

  const sendTokenMutation = useMutation({
    mutationFn: (token: string) =>
      firebaseService.createFcmToken({ token, appType: EAppType.NBYD_WEBAPP }),
  });

  useEffect(() => {
    if (authQuery.isSuccess) {
      requestFcmPermission().then((token) => {
        if (token) {
          sendTokenMutation.mutate(token);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authQuery.isSuccess]);

  return authQuery.isSuccess ? (
    <Layout
      hasSider
      css={css`
        min-height: 100dvh;
      `}
    >
      <MainSideNav collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <MainTopBar collapsed={collapsed} setCollapse={setCollapsed} />

        <Layout.Content
          className="main-content"
          css={css`
            margin: ${token.margin}px;
            padding: ${token.padding}px;
            background-color: ${token.colorBgContainer};
            border-radius: ${token.borderRadius}px;
            height: calc(100dvh - 64px - 2 * ${token.margin}px);
            overflow-y: auto;
            overflow: -moz-scrollbars-none;
            -ms-overflow-style: none;
          `}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  ) : (
    <Layout
      css={css`
        min-height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Spin size="large" />
    </Layout>
  );
}
