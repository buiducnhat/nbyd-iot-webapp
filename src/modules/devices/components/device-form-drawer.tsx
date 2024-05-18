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
import { EGatewayHardware } from '@/modules/gateways/gateway.model';
import { TProjectDetail } from '@/modules/projects/project.model';
import { isDefined, randomHexColor } from '@/shared/utils';

import {
  EDeviceDataType,
  EDeviceDataTypeOptions,
  EDeviceModeOptions,
  EDeviceType,
  EDeviceTypeOptions,
  TDevice,
} from '../device.model';
import deviceService from '../device.service';
import { TCreateDeviceDto } from '../dto/create-device.dto';
import { TUpdateDeviceDto } from '../dto/update-device.dto';
import { Z_DATASTREAM_PIN_OPTIONS } from '../dto/z-device-pin.enum';
import ParingModal from './pairing-modal';

type TGatewayFormDrawerProps = {
  open: boolean;
  isUpdate?: boolean;
  setOpen: (open: boolean) => void;
  project: TProjectDetail;
  refetch?: () => Promise<any>;
  device?: TDevice;
  devices: TDevice[];
};

const PAIR_TIMEOUT = 4 * 60;

const DeviceFormDrawer: React.FC<TGatewayFormDrawerProps> = ({
  open,
  isUpdate,
  setOpen,
  project,
  refetch,
  device,
  devices,
}: TGatewayFormDrawerProps) => {
  const { t, antdApp } = useApp();

  const [form] = Form.useForm<TCreateDeviceDto>();
  const formValues = Form.useWatch<TCreateDeviceDto>([], form);

  const connectedSocket = useAppStore((state) => state.connectedSocket);

  const [currentStep, setCurrentStep] = useState(isUpdate ? 2 : 0);
  const [gatewayId, setGatewayId] = useState<string>(project.gateways[0]?.id);
  const [openPairingModal, setOpenPairingModal] = useState(false);
  const [pairTimeout, setPairTimeout] = useState(PAIR_TIMEOUT);

  const createMutation = useMutation({
    mutationFn: (data: TCreateDeviceDto) =>
      deviceService.create(project.id, gatewayId, data),
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
    mutationFn: (data: TUpdateDeviceDto) =>
      device?.id
        ? deviceService.update(project.id, gatewayId, device.id, data)
        : Promise.reject(new Error('Device not found')),
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
        title: t('Select') + ' ' + t('Gateway'),
        content: (
          <>
            <Form.Item label={t('Gateway')} required>
              <Select
                value={gatewayId}
                onChange={(value) => setGatewayId(value)}
              >
                {project.gateways.map((gateway) => (
                  <Select.Option key={gateway.id} value={gateway.id}>
                    {gateway.name}
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
                disabled={!gatewayId}
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
            <Form.Item<TCreateDeviceDto> name="type" label={t('Type')} required>
              <Select>
                {EDeviceTypeOptions.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    disabled={
                      option.value === EDeviceType.ZIGBEE &&
                      !(
                        project.gateways.find((x) => x.id === gatewayId)
                          ?.hardware === EGatewayHardware.RASPBERRY_PI
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
                <Form.Item<TCreateDeviceDto>
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
                <Form.Item<TCreateDeviceDto>
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

            {(formValues?.type === EDeviceType.DIGITAL ||
              formValues?.type === EDeviceType.ANALOG) && (
              <Form.Item<TCreateDeviceDto>
                name="mode"
                label={t('Mode')}
                required
                rules={[{ required: true }]}
              >
                <Select>
                  {EDeviceModeOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {formValues?.type === EDeviceType.VIRTUAL && (
              <Form.Item<TCreateDeviceDto>
                name="dataType"
                label={t('Data type')}
                required
                rules={[{ required: true }]}
              >
                <Select>
                  {EDeviceDataTypeOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {formValues?.type !== EDeviceType.ZIGBEE ? (
              <Form.Item<TCreateDeviceDto>
                name="pin"
                label={t('Pin')}
                required
                rules={[{ required: true }]}
              >
                <Select>
                  {deviceService
                    .getListPinOptions(
                      formValues?.type,
                      devices
                        .filter((x) => x.gatewayId === gatewayId)
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
              <Form.Item<TCreateDeviceDto>
                name="pin"
                label={t('Zigbee Type')}
                required
                rules={[{ required: true }]}
              >
                <Select>
                  {Z_DATASTREAM_PIN_OPTIONS.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {t(`ZDevicePinLabel.${option.label}` as any)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {
              // Analog/Virtual (integer/float)
              (formValues?.type === EDeviceType.ANALOG ||
                (formValues?.type === EDeviceType.VIRTUAL &&
                  (formValues.dataType === EDeviceDataType.INTEGER ||
                    formValues.dataType === EDeviceDataType.FLOAT))) && (
                <>
                  <Form.Item<TCreateDeviceDto> name="unit" label={t('Unit')}>
                    <Input />
                  </Form.Item>

                  <Row>
                    <Col span={8}>
                      <Form.Item<TCreateDeviceDto>
                        labelCol={{ span: 12 }}
                        name="minValue"
                        label={t('Min')}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item<TCreateDeviceDto>
                        name="maxValue"
                        label={t('Max')}
                        labelCol={{ span: 12 }}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item<TCreateDeviceDto>
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
              formValues?.dataType === EDeviceDataType.STRING && (
                <Form.Item<TCreateDeviceDto>
                  name="defaultValue"
                  label={t('Default')}
                >
                  <Input />
                </Form.Item>
              )
            }

            <Divider />

            <Form.Item<TCreateDeviceDto>
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
      devices,
      gatewayId,
      form,
      formValues?.color,
      formValues?.dataType,
      formValues?.type,
      isUpdate,
      project.gateways,
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

    socket.emit('/z-devices/pair', {
      projectId: project.id,
      gatewayId,
      value: true,
      name: formValues?.name,
      pin: formValues?.pin,
    });
  }, [gatewayId, formValues?.name, formValues?.pin, project.id]);

  const onCancelPairing = useCallback(() => {
    setOpenPairingModal(false);
    socket.emit('/z-devices/pair', {
      projectId: project.id,
      gatewayId,
      value: false,
      name: formValues?.name,
      pin: formValues?.pin,
    });
  }, [gatewayId, formValues?.name, formValues?.pin, project.id]);

  useEffect(() => {
    if (!isUpdate) {
      form.resetFields();
    }
  }, [form, isUpdate]);

  useEffect(() => {
    if (isUpdate && device) {
      form.setFieldsValue(device);
      setGatewayId(device.gatewayId);
    }
  }, [device, form, isUpdate]);

  useEffect(() => {
    if (
      formValues?.type === EDeviceType.DIGITAL ||
      formValues?.type === EDeviceType.ANALOG
    ) {
      form.setFieldValue('dataType', EDeviceDataType.INTEGER);

      if (formValues?.type === EDeviceType.DIGITAL) {
        form.setFieldsValue({ minValue: 0, maxValue: 1, defaultValue: '0' });
      }
    }
  }, [form, formValues?.type]);

  useEffect(() => {
    if (connectedSocket) {
      socket.on('/z-devices/pair-result', (data: TDevice) => {
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
        onCancel={onCancelPairing}
      />

      <Drawer
        title={isUpdate ? t('Update') : t('Create new') + ' ' + t('Device')}
        open={open}
        onClose={() => setOpen(false)}
        width={720}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

            {formValues?.type !== EDeviceType.ZIGBEE ? (
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
          name={'device-form' + (isUpdate ? '-update' : '-create')}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={(values) => {
            if (values.type === EDeviceType.DIGITAL) {
              values.dataType = EDeviceDataType.INTEGER;
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
          initialValues={isUpdate ? device : { color: randomHexColor() }}
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

export default DeviceFormDrawer;
