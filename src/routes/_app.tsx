import { useMutation } from '@tanstack/react-query';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Image, Layout, Space, Spin } from 'antd';
import { onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

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
import { TST } from '@/shared/types/tst.type';

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
    <Layout hasSider style={{ minHeight: '100dvh' }}>
      <MainSideNav collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <MainTopBar collapsed={collapsed} setCollapse={setCollapsed} />

        <SContent $token={token} className="main-content">
          <Outlet />
        </SContent>
      </Layout>
    </Layout>
  ) : (
    <Layout
      style={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="large" />
    </Layout>
  );
}

const SContent = styled(Layout.Content)<TST>`
  margin: ${({ $token }) => $token.margin}px;
  padding: ${({ $token }) => $token.padding}px;
  background-color: ${({ $token }) => $token.colorBgContainer};
  border-radius: ${({ $token }) => $token.borderRadius}px;
  height: calc(100dvh - 64px - 2 * ${({ $token }) => $token.margin}px);
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
`;
