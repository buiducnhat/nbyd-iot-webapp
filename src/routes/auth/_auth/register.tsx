import { css } from '@emotion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Button, Divider, Flex, Form, Input, Layout, Typography } from 'antd';
import { AxiosError } from 'axios';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import { TRegisterInput } from '@/modules/auth/auth.model';
import authService from '@/modules/auth/auth.service';
import { THttpResponse } from '@/shared/http-service';
import { transApiResDataCode } from '@/shared/utils';

export const Route = createFileRoute('/auth/_auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const { t, antdApp, token } = useApp();

  const queryClient = useQueryClient();
  const setLoading = useAppStore((state) => state.setLoading);

  const [form] = Form.useForm<TRegisterInput>();

  const registerMutation = useMutation({
    mutationFn: (input: TRegisterInput) => authService.register(input),
    onSuccess: () => {
      antdApp.notification.success({
        message: t('Register successfully'),
      });
      queryClient.refetchQueries({ queryKey: ['/auth/getMe'] });
      setLoading(false);
    },
    onError: (error: AxiosError<THttpResponse<null>>) => {
      antdApp.notification.error({
        message: t('Register failed'),
        description: transApiResDataCode(t, error.response?.data),
      });
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onFinish = async (data: TRegisterInput) => {
    registerMutation.mutate(data);
  };

  const onFinishFailed = () => {
    antdApp.notification.error({
      message: t('Register failed'),
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
          min-height: 100dvh;
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
          justify="center"
        >
          <Typography.Title level={2}>
            {t('Create new account')}
          </Typography.Title>

          <Form
            css={css`
              width: 100%;
            `}
            form={form}
            size="large"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{
              xs: { span: 24 },
              sm: { span: 6 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 18 },
            }}
          >
            <Form.Item<TRegisterInput>
              name="email"
              label={t('Email')}
              rules={[
                {
                  type: 'email',
                  message: t('Invalid email'),
                },
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>

            <Form.Item<TRegisterInput>
              name="firstName"
              label={t('First name')}
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>

            <Form.Item<TRegisterInput> name="lastName" label={t('Last name')}>
              <Input variant="filled" />
            </Form.Item>

            <Form.Item<TRegisterInput>
              name="phoneNumber"
              label={t('Phone number')}
            >
              <Input variant="filled" />
            </Form.Item>

            <Form.Item<TRegisterInput>
              name="username"
              label={t('Username')}
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>

            <Form.Item<TRegisterInput>
              name="password"
              label={t('Password')}
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input.Password variant="filled" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={t('Confirm password')}
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input.Password variant="filled" />
            </Form.Item>

            <Flex justify="center">
              <Button type="primary" htmlType="submit">
                {t('Register')}
              </Button>
            </Flex>

            <Divider>
              <Typography.Text type="secondary">
                {t('Or register with your social account')}
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
                margin-top: ${token.marginXXL}px;
              `}
              justify="center"
              gap={token.sizeUnit}
            >
              <Typography.Text>{t('Already have an account?')}</Typography.Text>
              <Link to="/auth/login">
                <Typography.Link>{t('Login here')}</Typography.Link>
              </Link>
            </Flex>
          </Form>
        </Flex>
      </Layout.Content>
    </>
  );
}

export default RegisterPage;
