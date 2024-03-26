import { useMutation } from '@tanstack/react-query';
import { Button, Drawer, Form, Input, Skeleton, Space } from 'antd';
import * as _ from 'ramda';
import { useEffect } from 'react';

import useApp from '@/hooks/use-app';
import UploadImage from '@/shared/components/upload-image';

import useGetProjectDetail from '../hooks/use-get-project-detail';
import projectService from '../project.service';

type TProjectFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: string;
  refetch?: () => Promise<any>;
};

type TFormValues = {
  name: string;
  description?: string;
};

const ProjectFormDrawer: React.FC<TProjectFormDrawerProps> = ({
  open,
  setOpen,
  action,
  id,
  refetch,
}: TProjectFormDrawerProps) => {
  const { t, antdApp } = useApp();

  const [form] = Form.useForm<TFormValues>();
  const formValues = Form.useWatch<TFormValues>([], form);

  const { project, projectQuery } = useGetProjectDetail(id || '');

  const createMutation = useMutation({
    mutationFn: (data: any) => projectService.create(data),
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
      id ? projectService.update(id, data) : (null as any),
    onSuccess: async () => {
      refetch && (await refetch());
      antdApp.message.success(t('Updated successfully'));
      setOpen(false);
      // form.resetFields();
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    }
  }, [action, form]);

  useEffect(() => {
    if (project && action === 'update') {
      form.setFieldsValue(project);
    }
  }, [action, form, project]);

  return (
    <Drawer
      forceRender
      title={
        action === 'create' ? t('Create new project') : t('Update project')
      }
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={
              projectQuery.isLoading ||
              _.equals(formValues, {
                name: project?.name,
                description: project?.description,
              } as TFormValues)
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
      {action === 'update' && projectQuery.isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="projects"
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
                  id,
                });
          }}
        >
          <Form.Item<TFormValues> name="name" label={t('Name')} required>
            <Input />
          </Form.Item>

          <Form.Item<TFormValues> name="description" label={t('Description')}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label={t('Image')}>
            <UploadImage
              initialImageUrl={project?.imageFileUrl}
              onUpload={async (file) => {
                if (!id) return;

                const uploaded = await projectService.uploadImage(id, file);
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

export default ProjectFormDrawer;
