import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Col,
  ColorPicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Steps,
  Switch,
} from 'antd';
import { DevTool as AntdFormDevtool } from 'antd-form-devtools';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import { socket } from '@/modules/app/socket-io';
import { EDeviceHardware } from '@/modules/devices/device.model';
import { TProjectDetail } from '@/modules/projects/project.model';
import { isDefined, randomHexColor } from '@/shared/utils';

import {
  EDatastreamDataType,
  EDatastreamDataTypeOptions,
  EDatastreamModeOptions,
  EDatastreamType,
  EDatastreamTypeOptions,
  TDatastream,
} from '../datastream.model';
import datastreamService from '../datastream.service';
import { TCreateDatastreamDto } from '../dto/create-datastream.dto';
import { TUpdateDatastreamDto } from '../dto/update-datastream.dto';
import { Z_DATASTREAM_PIN_OPTIONS } from '../dto/z-datastream-pin.enum';
import ParingModal from './pairing-modal';

type TDeviceFormDrawerProps = {
  open: boolean;
  isUpdate?: boolean;
  setOpen: (open: boolean) => void;
  project: TProjectDetail;
  refetch?: () => Promise<any>;
  datastream?: TDatastream;
  datastreams: TDatastream[];
};

const PAIR_TIMEOUT = 5;

const DatastreamFormDrawer: React.FC<TDeviceFormDrawerProps> = ({
  open,
  isUpdate,
  setOpen,
  project,
  refetch,
  datastream,
  datastreams,
}: TDeviceFormDrawerProps) => {
  const { t, antdApp } = useApp();

  const [form] = Form.useForm<TCreateDatastreamDto>();
  const formValues = Form.useWatch<TCreateDatastreamDto>([], form);

  const connectedSocket = useAppStore((state) => state.connectedSocket);

  const [currentStep, setCurrentStep] = useState(isUpdate ? 2 : 0);
  const [deviceId, setDeviceId] = useState<string>(project.devices[0]?.id);
  const [openPairingModal, setOpenPairingModal] = useState(false);
  const [pairTimeout, setPairTimeout] = useState(PAIR_TIMEOUT);

  const createMutation = useMutation({
    mutationFn: (data: TCreateDatastreamDto) =>
      datastreamService.create(project.id, deviceId, data),
    onSuccess: async () => {
      refetch && (await refetch());
      antdApp.message.success(t('Created successfully'));
      setOpen(false);
      form.resetFields();
      setCurrentStep(0);
    },
    onError: (error) => {
      antdApp.message.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TUpdateDatastreamDto) =>
      datastream?.id
        ? datastreamService.update(project.id, deviceId, datastream.id, data)
        : Promise.reject(new Error('Datastream not found')),
    onSuccess: async () => {
      refetch && (await refetch());
      antdApp.message.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
      setCurrentStep(0);
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
            <Form.Item<TCreateDatastreamDto>
              name="type"
              label={t('Type')}
              required
            >
              <Select>
                {EDatastreamTypeOptions.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    disabled={
                      option.value === EDatastreamType.ZIGBEE &&
                      !(
                        project.devices.find((x) => x.id === deviceId)
                          ?.hardware === EDeviceHardware.RASPBERRY_PI
                      )
                    }
                  >
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
                  disabled={!formValues?.type}
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
            <Row>
              <Col span={16}>
                <Form.Item<TCreateDatastreamDto>
                  name="name"
                  label={t('Name')}
                  labelCol={{ span: 6 }}
                  required
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item<TCreateDatastreamDto>
                  name="color"
                  label={t('Color')}
                  labelCol={{ span: 20 }}
                >
                  <ColorPicker
                    value={formValues?.color}
                    onChangeComplete={(_color) =>
                      form.setFieldsValue({ color: _color.toHexString() })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {(formValues?.type === EDatastreamType.DIGITAL ||
              formValues?.type === EDatastreamType.ANALOG) && (
              <Form.Item<TCreateDatastreamDto>
                name="mode"
                label={t('Mode')}
                required
                rules={[{ required: true }]}
              >
                <Select>
                  {EDatastreamModeOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {formValues?.type === EDatastreamType.VIRTUAL && (
              <Form.Item<TCreateDatastreamDto>
                name="dataType"
                label={t('Data type')}
                required
                rules={[{ required: true }]}
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

            {formValues?.type !== EDatastreamType.ZIGBEE ? (
              <Form.Item<TCreateDatastreamDto>
                name="pin"
                label={t('Pin')}
                required
                rules={[{ required: true }]}
              >
                <Select>
                  {datastreamService
                    .getListPinOptions(
                      formValues?.type,
                      datastreams
                        .filter((x) => x.deviceId === deviceId)
                        .map((x) => x.pin as string),
                    )
                    .map((option) => (
                      <Select.Option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            ) : (
              <>
                <Form.Item<TCreateDatastreamDto>
                  name="mac"
                  label={t('Mac')}
                  help={t('format_zigbee_mac_help')}
                  rules={[
                    {
                      pattern: /^0x[a-fA-F0-9]{12}$/,
                      message: t('mac_address_invalid'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item<TCreateDatastreamDto>
                  name="pin"
                  label={t('Zigbee Type')}
                  required
                  rules={[{ required: true }]}
                >
                  <Select>
                    {Z_DATASTREAM_PIN_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {t(`ZDatastreamPinLabel.${option.label}` as any)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}

            {
              // Analog/Virtual (integer/float)
              (formValues?.type === EDatastreamType.ANALOG ||
                (formValues?.type === EDatastreamType.VIRTUAL &&
                  (formValues.dataType === EDatastreamDataType.INTEGER ||
                    formValues.dataType === EDatastreamDataType.FLOAT))) && (
                <>
                  <Form.Item<TCreateDatastreamDto>
                    name="unit"
                    label={t('Unit')}
                  >
                    <Input />
                  </Form.Item>

                  <Row>
                    <Col span={8}>
                      <Form.Item<TCreateDatastreamDto>
                        labelCol={{ span: 12 }}
                        name="minValue"
                        label={t('Min')}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item<TCreateDatastreamDto>
                        name="maxValue"
                        label={t('Max')}
                        labelCol={{ span: 12 }}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item<TCreateDatastreamDto>
                        name="defaultValue"
                        label={t('Default')}
                        labelCol={{ span: 12 }}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )
            }

            {
              // String
              formValues?.dataType === EDatastreamDataType.STRING && (
                <Form.Item<TCreateDatastreamDto>
                  name="defaultValue"
                  label={t('Default')}
                >
                  <Input />
                </Form.Item>
              )
            }

            <Divider />

            <Form.Item<TCreateDatastreamDto>
              name="enabledHistory"
              label={t('Enabled history')}
            >
              <Switch />
            </Form.Item>

            {!isUpdate && (
              <>
                <Divider />

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
              </>
            )}
          </>
        ),
      },
    ],
    [
      datastreams,
      deviceId,
      form,
      formValues?.color,
      formValues?.dataType,
      formValues?.type,
      isUpdate,
      project.devices,
      t,
    ],
  );
  const stepItems = useMemo(
    () => steps.map((step) => ({ key: step.title, title: step.title })),
    [steps],
  );

  const onPairButton = useCallback(() => {
    setOpenPairingModal(true);
    setPairTimeout(PAIR_TIMEOUT);

    socket.emit('/z-datastreams/pair', {
      projectId: project.id,
      deviceId,
      name: formValues?.name,
      mac: formValues?.mac,
      pin: formValues?.pin,
    });
  }, [
    deviceId,
    formValues?.mac,
    formValues?.name,
    formValues?.pin,
    project.id,
  ]);

  useEffect(() => {
    if (!isUpdate) {
      form.resetFields();
    }
  }, [form, isUpdate]);

  useEffect(() => {
    if (isUpdate && datastream) {
      form.setFieldsValue(datastream);
      setDeviceId(datastream.deviceId);
    }
  }, [datastream, form, isUpdate]);

  useEffect(() => {
    if (
      formValues?.type === EDatastreamType.DIGITAL ||
      formValues?.type === EDatastreamType.ANALOG
    ) {
      form.setFieldValue('dataType', EDatastreamDataType.INTEGER);

      if (formValues?.type === EDatastreamType.DIGITAL) {
        form.setFieldsValue({ minValue: 0, maxValue: 1, defaultValue: '0' });
      }
    }
  }, [form, formValues?.type]);

  useEffect(() => {
    if (connectedSocket) {
      socket.on('/z-datastreams/pair-result', (data: TDatastream) => {
        if (data) {
          refetch && refetch();
          setOpenPairingModal(false);
          setOpen(false);
          antdApp.message.success(t('Paired successfully'));
        }
      });
    }
  }, [antdApp.message, connectedSocket, refetch, setOpen, t]);

  useInterval(() => {
    if (openPairingModal) {
      setPairTimeout((prev) => {
        if (prev === 1) {
          setOpenPairingModal(false);
          antdApp.message.error(t('Pairing timeout'));
        }

        return prev - 1;
      });
    }
  }, 1000);

  return (
    <>
      <ParingModal
        open={openPairingModal}
        setOpen={setOpenPairingModal}
        timeout={pairTimeout}
      />

      <Drawer
        title={isUpdate ? t('Update') : t('Create new') + ' ' + t('Datastream')}
        open={open}
        onClose={() => setOpen(false)}
        width={720}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

            {formValues?.type !== EDatastreamType.ZIGBEE ? (
              <Button
                type="primary"
                loading={createMutation.isPending}
                disabled={currentStep < 2 || createMutation.isPending}
                onClick={() => {
                  form.submit();
                }}
              >
                {t('Submit')}
              </Button>
            ) : (
              <Button
                type="primary"
                disabled={currentStep < 2}
                onClick={onPairButton}
              >
                {t('Pair')}
              </Button>
            )}
          </Space>
        }
      >
        <Steps size="small" items={stepItems} current={currentStep} />

        <div
          css={css`
            margin-top: 24px;
          `}
        />

        <Form
          form={form}
          name={'datastream-form' + (isUpdate ? '-update' : '-create')}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={(values) => {
            if (values.type === EDatastreamType.DIGITAL) {
              values.dataType = EDatastreamDataType.INTEGER;
              values.minValue = 0;
              values.maxValue = 1;
            }

            if (isDefined(values.defaultValue)) {
              values.defaultValue = String(values.defaultValue);
            }

            isUpdate
              ? updateMutation.mutate({
                  ...values,
                })
              : createMutation.mutate({
                  ...values,
                });
          }}
          initialValues={isUpdate ? datastream : { color: randomHexColor() }}
        >
          {steps.map((step, index) => (
            <div
              key={step.title}
              css={css`
                display: ${index === currentStep ? 'block' : 'none'};
              `}
            >
              {step.content}
            </div>
          ))}

          <AntdFormDevtool />
        </Form>
      </Drawer>
    </>
  );
};

export default DatastreamFormDrawer;
