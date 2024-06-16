import {
  BellOutlined,
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
  UnlockFilled,
  UserOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  MenuProps,
  Switch,
  theme,
} from 'antd';
import { useCallback, useMemo } from 'react';

import useApp from '@/hooks/use-app';
import i18n from '@/i18n';
import { useAppStore } from '@/modules/app/app.zustand';
import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';

const MainTopBar = () => {
  const { t, token } = useApp();

  const gTheme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      navigate({
        to: '/auth/login',
      });
    },
    onError: () => {
      setUser(null);
      navigate({
        to: '/auth/login',
      });
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const dropItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to={'/profile'}>{t('Profile')}</Link>,
      },
      {
        key: 'logout',
        icon: <UnlockFilled />,
        label: <span onClick={() => handleLogout()}>{t('Logout')}</span>,
      },
    ],
    [t, handleLogout],
  );

  return (
    <Layout.Header
      css={css`
        background: ${token.colorBgContainer};
        display: flex;
        padding: 0;
        top: 0;
        z-index: 1;
        position: sticky;
        width: 100%;
        align-items: center;
      `}
    >
      <div
        css={css`
          cursor: pointer;
          width: 100%;
          padding: ${token.paddingSM}px;
          display: flex;
          align-items: center;
        `}
        onClick={() => navigate({ to: '/' })}
      >
        <img
          src="/assets/images/logo.png"
          alt="logo"
          width={24}
          css={css`
            border-radius: ${token.borderRadius}px;
            transition: ease-in-out 1s;
          `}
        />
      </div>

      <div
        css={css`
          flex: 1;
        `}
      />

      <Flex
        css={css`
          margin-right: ${token.margin}px;
        `}
        align="center"
        gap={token.size}
      >
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'en', label: 'English' },
              { key: 'vi', label: 'Tiếng Việt' },
            ].map((item) => ({
              ...item,
              onClick: () => {
                i18n.changeLanguage(item.key);
                localStorage.setItem('lang', item.key);
              },
            })),
          }}
          placement="bottomRight"
        >
          <Button icon={<GlobalOutlined />} type="text"></Button>
        </Dropdown>

        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={gTheme.algorithm.includes(theme.darkAlgorithm)}
          onChange={() => toggleTheme()}
        />

        <Button icon={<BellOutlined />} type="link"></Button>

        <Dropdown
          trigger={['click']}
          menu={{ items: dropItems }}
          placement="bottomRight"
        >
          <Avatar
            css={css`
              cursor: pointer;
              border: 2px solid ${token.colorBorder};
            `}
            size={48}
            src={user?.avatarImageFileUrl}
          >
            {user?.firstName.charAt(0)}
          </Avatar>
        </Dropdown>
      </Flex>
    </Layout.Header>
  );
};

export default MainTopBar;
