import { useMutation } from '@tanstack/react-query';
import {
  Button,
  ColorPicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Steps,
} from 'antd';
import { DevTool as AntdFormDevtool } from 'antd-form-devtools';
import { useEffect, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TProjectDetail } from '@/modules/projects/project.model';

import {
  EDatastreamDataType,
  EDatastreamDataTypeOptions,
  EDatastreamModeOptions,
  EDatastreamType,
  EDatastreamTypeOptions,
  TDatastream,
} from '../datastream.model';
import datastreamService from '../datastream.service';
import { CreateDatastreamDto } from '../dto/create-datastream.dto';
import { UpdateDatastreamDto } from '../dto/update-datastream.dto';

type TDeviceFormDrawerProps = {
  open: boolean;
  isUpdate?: boolean;
  setOpen: (open: boolean) => void;
  project: TProjectDetail;
  refetch?: () => Promise<any>;
  datastream?: TDatastream;
};

const DatastreamFormDrawer: React.FC<TDeviceFormDrawerProps> = ({
  open,
  isUpdate,
  setOpen,
  project,
  refetch,
  datastream,
}: TDeviceFormDrawerProps) => {
  const { t, antdApp } = useApp();

  const [form] = Form.useForm<TDatastream>();

  const [currentStep, setCurrentStep] = useState(isUpdate ? 2 : 0);
  const [deviceId, setDeviceId] = useState<string>(project.devices[0]?.id);
  const type = Form.useWatch<EDatastreamType>('type', form);
  const dataType = Form.useWatch<EDatastreamDataType>('dataType', form);
  const color = Form.useWatch<string>('color', form);

  const createMutation = useMutation({
    mutationFn: (data: CreateDatastreamDto) =>
      datastreamService.create(project.id, deviceId, data),
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
    mutationFn: (data: UpdateDatastreamDto) =>
      datastream?.id
        ? datastreamService.update(project.id, deviceId, datastream.id, data)
        : Promise.reject(new Error('Datastream not found')),
    onSuccess: async () => {
      refetch && (await refetch());
      antdApp.message.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const steps = useMemo(
    () => [
      {
        title: t('Select') + ' ' + t('Device'),
        content: (
          <>
            <Form.Item label={t('Device')} required>
              <Select value={deviceId} onChange={(value) => setDeviceId(value)}>
                {project.devices.map((device) => (
                  <Select.Option key={device.id} value={device.id}>
                    {device.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
              <Button
                type="primary"
                onClick={() => {
                  setCurrentStep(1);
                }}
                disabled={!deviceId}
              >
                {t('Next')}
              </Button>
            </Form.Item>
          </>
        ),
      },
      {
        title: t('Select') + ' ' + t('Type'),
        content: (
          <>
            <Form.Item<CreateDatastreamDto>
              name="type"
              label={t('Type')}
              required
            >
              <Select>
                {EDatastreamTypeOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
              <Space>
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                  }}
                >
                  {t('Previous')}
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    setCurrentStep(2);
                  }}
                  disabled={!type}
                >
                  {t('Next')}
                </Button>
              </Space>
            </Form.Item>
          </>
        ),
      },
      {
        title: t('Complete'),
        content: (
          <>
            <Form.Item<CreateDatastreamDto>
              name="name"
              label={t('Name')}
              required
            >
              <Input />
            </Form.Item>

            <Form.Item<CreateDatastreamDto> name="color" label={t('Color')}>
              <ColorPicker
                value={color}
                onChangeComplete={(_color) =>
                  form.setFieldsValue({ color: _color.toHexString() })
                }
              />
            </Form.Item>

            {(type === EDatastreamType.DIGITAL ||
              type === EDatastreamType.ANALOG) && (
              <Form.Item<CreateDatastreamDto> name="mode" label={t('Mode')}>
                <Select>
                  {EDatastreamModeOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {type === EDatastreamType.VIRTUAL && (
              <Form.Item<CreateDatastreamDto>
                name="dataType"
                label={t('Data type')}
                required
              >
                <Select>
                  {EDatastreamDataTypeOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item<CreateDatastreamDto> name="pin" label={t('Pin')}>
              <Select>
                {datastreamService.getListPinOptions(type).map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {type !== EDatastreamType.DIGITAL &&
              type !== EDatastreamType.ZIGBEE && (
                <Form.Item<CreateDatastreamDto> name="unit" label={t('Unit')}>
                  <Input />
                </Form.Item>
              )}

            {(type === EDatastreamType.ANALOG ||
              dataType === EDatastreamDataType.INTEGER ||
              dataType === EDatastreamDataType.FLOAT) && (
              <Form.Item label={t('Extra')}>
                <Space.Compact>
                  <Form.Item<CreateDatastreamDto> name="minValue" noStyle>
                    <InputNumber placeholder={t('Min')} defaultValue={0} />
                  </Form.Item>

                  <Form.Item<CreateDatastreamDto> name="maxValue" noStyle>
                    <InputNumber placeholder={t('Max')} defaultValue={1} />
                  </Form.Item>

                  <Form.Item<CreateDatastreamDto> name="defaultValue" noStyle>
                    <InputNumber placeholder={t('Default')} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            )}

            {dataType === EDatastreamDataType.STRING && (
              <Form.Item<CreateDatastreamDto>
                name="defaultValue"
                label={t('Default value')}
              >
                <Input />
              </Form.Item>
            )}

            {!isUpdate && (
              <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
                <Button
                  onClick={() => {
                    form.resetFields([
                      'mode',
                      'dataType',
                      'pin',
                      'minValue',
                      'maxValue',
                      'defaultValue',
                      'unit',
                    ]);
                    setCurrentStep(1);
                  }}
                >
                  {t('Previous')}
                </Button>
              </Form.Item>
            )}
          </>
        ),
      },
    ],
    [color, dataType, deviceId, form, isUpdate, project.devices, t, type],
  );
  const stepItems = useMemo(
    () => steps.map((step) => ({ key: step.title, title: step.title })),
    [steps],
  );

  useEffect(() => {
    if (!isUpdate) {
      form.resetFields();
    }
  }, [form, isUpdate]);

  useEffect(() => {
    if (isUpdate && datastream) {
      form.setFieldsValue(datastream);
    }
  }, [datastream, form, isUpdate]);

  return (
    <Drawer
      title={isUpdate ? t('Update') : t('Create new') + ' ' + t('Datastream')}
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending}
            disabled={createMutation.isPending}
            onClick={() => {
              form.submit();
            }}
          >
            {t('Submit')}
          </Button>
        </Space>
      }
    >
      <Steps size="small" items={stepItems} current={currentStep} />

      <div style={{ marginTop: 24 }} />

      <Form
        form={form}
        name="datastreams-form"
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) => {
          isUpdate
            ? updateMutation.mutate({
                ...values,
              })
            : createMutation.mutate({
                ...values,
              });
        }}
        initialValues={datastream}
      >
        {steps.map((step, index) => (
          <div
            key={step.title}
            style={{ display: index === currentStep ? 'block' : 'none' }}
          >
            {step.content}
          </div>
        ))}

        <AntdFormDevtool />
      </Form>
    </Drawer>
  );
};

export default DatastreamFormDrawer;
