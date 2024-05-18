import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Skeleton, Space } from 'antd';
import * as _ from 'ramda';
import { useEffect } from 'react';

import useApp from '@/hooks/use-app';
import UploadImage from '@/shared/components/upload-image';

import { TCreateGatewayDto } from '../dto/create-gateway.dto';
import {
  EGatewayConnectionOptions,
  EGatewayHardwareOptions,
  TGateway,
} from '../gateway.model';
import gatewayService from '../gateway.service';

type TGatewayFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  projectId: string;
  gateway?: TGateway;
  refetch?: () => Promise<any>;
};

const GatewayFormDrawer: React.FC<TGatewayFormDrawerProps> = ({
  open,
  setOpen,
  action,
  projectId,
  gateway,
  refetch,
}: TGatewayFormDrawerProps) => {
  const { t, antdApp } = useApp();

  const [form] = Form.useForm<TCreateGatewayDto>();
  const formValues = Form.useWatch([], form);

  const createMutation = useMutation({
    mutationFn: (data: TCreateGatewayDto) =>
      gatewayService.create(projectId, data),
    onSuccess: async () => {
      refetch && (await refetch());
      antdApp.message.success(t('Created successfully'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TCreateGatewayDto) =>
      gateway
        ? gatewayService.update(projectId, gateway.id, data)
        : (null as any),
    onSuccess: async () => {
      refetch && (await refetch());
      antdApp.message.success(t('Updated successfully'));
      setOpen(false);
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  useEffect(() => {
    if (gateway) {
      form.setFieldsValue(gateway);
    }
  }, [gateway, form]);

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    }
  }, [action, form]);

  return (
    <Drawer
      title={action === 'create' ? t('Create new') : t('Update') + t('Gateway')}
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      forceRender
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              _.equals(formValues, {
                name: gateway?.name,
                hardware: gateway?.hardware,
                connection: gateway?.connection,
                description: gateway?.description,
              } as TCreateGatewayDto)
            }
            onClick={() => {
              form.submit();
            }}
          >
            {t('Submit')}
          </Button>
        </Space>
      }
    >
      {action === 'update' && !gateway ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          name="gateways"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            action === 'create'
              ? createMutation.mutate({
                  ...values,
                })
              : updateMutation.mutate({
                  ...values,
                });
          }}
        >
          <Form.Item<TCreateGatewayDto> name="name" label={t('Name')} required>
            <Input />
          </Form.Item>

          <Form.Item<TCreateGatewayDto>
            name="hardware"
            label={t('Hardware')}
            required
          >
            <Select disabled={action === 'update'}>
              {EGatewayHardwareOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<TCreateGatewayDto>
            name="connection"
            label={t('Connection')}
            required
          >
            <Select disabled={action === 'update'}>
              {EGatewayConnectionOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<TCreateGatewayDto>
            name="description"
            label={t('Description')}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item label={t('Image')}>
            <UploadImage
              initialImageUrl={gateway?.imageFileUrl}
              onUpload={async (file) => {
                if (!gateway?.id) return;

                const uploaded = await gatewayService.uploadImage(
                  projectId,
                  gateway.id,
                  file,
                );
                if (uploaded.data.imageFileUrl) {
                  return uploaded.data.imageFileUrl;
                }

                return;
              }}
              onUploadSuccess={async () => {
                refetch && (await refetch());
              }}
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default GatewayFormDrawer;
