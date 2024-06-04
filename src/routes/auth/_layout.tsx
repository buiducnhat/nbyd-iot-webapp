import { css } from '@emotion/react';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout, Spin } from 'antd';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/modules/auth/auth.zustand';

export const Route = createFileRoute('/auth/_layout')({
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const search: any = Route.useSearch();

  const authQuery = useAuth();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate({
        to: search?.from || '/',
      });
    }
  }, [navigate, search?.from, user]);

  if (authQuery.isPending && !user) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <Layout
      css={css`
        background-image: url(/assets/images/iot-bg.jpeg);
        background-size: cover;
      `}
    >
      <Outlet />
    </Layout>
  );
}
