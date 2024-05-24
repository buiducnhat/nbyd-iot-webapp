import { LockFilled, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  Typography,
} from 'antd';
import { AxiosError } from 'axios';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import { TLoginInput } from '@/modules/auth/auth.model';
import authService from '@/modules/auth/auth.service';
import { THttpResponse } from '@/shared/http-service';
import { transApiResDataCode } from '@/shared/utils';

export const Route = createFileRoute('/auth/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const { t, antdApp, token } = useApp();

  const queryClient = useQueryClient();
  const setLoading = useAppStore((state) => state.setLoading);

  const [form] = Form.useForm<TLoginInput>();

  const loginMutation = useMutation({
    mutationFn: (input: TLoginInput) => authService.login(input),
    onSuccess: () => {
      antdApp.notification.success({
        message: t('Login successfully'),
      });
      queryClient.refetchQueries({ queryKey: ['/auth/getMe'] });
      setLoading(false);
    },
    onError: (error: AxiosError<THttpResponse<null>>) => {
      antdApp.notification.error({
        message: t('Login failed'),
        description: transApiResDataCode(t, error.response?.data),
      });
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onFinish = async (data: TLoginInput) => {
    loginMutation.mutate(data);
  };

  const onFinishFailed = () => {
    antdApp.notification.error({
      message: t('Login failed'),
      description: t('Please contact the administrator'),
    });
  };

  const iconCss = css`
    cursor: pointer;
    transition: ${token.motionEaseInOut};
    :hover {
      scale: 1.2;
    }
  `;

  return (
    <>
      <Layout.Content
        css={css`
          height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: ${token.paddingXL}px;
          @media screen and (max-width: ${token.screenSM}px) {
            padding: 0;
          }
        `}
      >
        <Flex
          css={css`
            background-color: ${token.colorBgContainer}80;
            padding: ${token.padding}px;
            backdrop-filter: blur(20px);
            width: ${token.screenSM}px;
            @media screen and (max-width: ${token.screenSM}px) {
              width: 100%;
              height: 100%;
            }
          `}
          vertical
          gap={24}
          align="center"
        >
          <Typography.Title level={2}>{t('Welcome')}</Typography.Title>

          <Form
            css={css`
              width: 100%;
            `}
            form={form}
            layout="vertical"
            size="large"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item<TLoginInput>
              name="usernameOrEmail"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input
                variant="filled"
                placeholder={t('Enter your username or email')}
                prefix={
                  <UserOutlined
                    css={css`
                      color: ${token.colorPrimary};
                    `}
                  />
                }
              />
            </Form.Item>

            <Form.Item<TLoginInput>
              name="password"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input.Password
                variant="filled"
                placeholder={t('Enter your password')}
                prefix={
                  <LockFilled
                    css={css`
                      color: ${token.colorPrimary};
                    `}
                  />
                }
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Flex justify="space-between">
                <Checkbox>{t('Remember me')}</Checkbox>

                <Typography.Link
                  css={css`
                    text-align: end;
                  `}
                >
                  {t('Forgot password?')}
                </Typography.Link>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                css={css`
                  width: 100%;
                `}
                type="primary"
                htmlType="submit"
              >
                {t('Login')}
              </Button>
            </Form.Item>

            <Divider>
              <Typography.Text type="secondary">
                {t('Or login with your social account')}
              </Typography.Text>
            </Divider>

            <Flex justify="space-evenly">
              <FcGoogle fontSize={token.fontSizeHeading2} css={iconCss} />

              <FaFacebook
                fontSize={token.fontSizeHeading2}
                color={token.blue}
                css={iconCss}
              />

              <FaGithub fontSize={token.fontSizeHeading2} css={iconCss} />
            </Flex>

            <Flex
              css={css`
                margin-top: ${token.marginXL}px;
              `}
              justify="center"
              gap={token.sizeUnit}
            >
              <Typography.Text>{t("Don't have an account?")}</Typography.Text>
              <Link to="/auth/register">
                <Typography.Link>{t('Create new account')}</Typography.Link>
              </Link>
            </Flex>
          </Form>
        </Flex>
      </Layout.Content>
    </>
  );
}

export default LoginPage;
