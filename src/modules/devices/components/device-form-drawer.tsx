import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect } from 'react';

import useApp from '@/hooks/use-app';

import {
  EDeviceConnectionOptions,
  EDeviceHardwareOptions,
  TDevice,
} from '../device.model';
import deviceService from '../device.service';
import { TCreateDeviceDto } from '../dto/create-device.dto';

type TDeviceFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  projectId: string;
  device?: TDevice;
  refetch?: () => Promise<any>;
};

const DeviceFormDrawer: React.FC<TDeviceFormDrawerProps> = ({
  open,
  setOpen,
  action,
  projectId,
  device,
  refetch,
}: TDeviceFormDrawerProps) => {
  const { t, antdApp } = useApp();

  const [form] = Form.useForm<TCreateDeviceDto>();

  const createMutation = useMutation({
    mutationFn: (data: any) => deviceService.create(projectId, data),
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
    mutationFn: (data: any) =>
      device ? deviceService.update(projectId, device.id, data) : (null as any),
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
    if (device) {
      form.setFieldsValue(device);
    }
  }, [device, form]);

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    }
  }, [action, form]);

  return (
    <Drawer
      title={action === 'create' ? t('Create new') : t('Update') + t('Device')}
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={createMutation.isPending || updateMutation.isPending}
            onClick={() => {
              form.submit();
            }}
          >
            {t('Submit')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="devices"
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
        <Form.Item name="name" label={t('Name')} required>
          <Input />
        </Form.Item>

        <Form.Item name="hardware" label={t('Hardware')} required>
          <Select disabled={action === 'update'}>
            {EDeviceHardwareOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="connection" label={t('Connection')} required>
          <Select disabled={action === 'update'}>
            {EDeviceConnectionOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label={t('Description')}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DeviceFormDrawer;
