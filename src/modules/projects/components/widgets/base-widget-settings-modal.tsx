import { css } from '@emotion/react';
import {
  Col,
  ColorPicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Slider,
  Switch,
} from 'antd';
import { DevTool } from 'antd-form-devtools';
import { useEffect, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TDevice } from '@/modules/devices/device.model';
import BaseDashboardItem from '@/modules/projects/components/base-dashboard-item';

import { FULL_ATTRIBUTES_WIDGETS, TDashboardItem, TValidDeviceType } from '.';

type TBaseWidgetSettingsFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dashboardItems: TDashboardItem[];
  dashboardItem: TDashboardItem;
  initTitle?: string;
  devices: TDevice[];
  onSave: (dashboardItems: TDashboardItem[]) => void;
};

const BaseWidgetSettingsModal = ({
  open,
  setOpen,
  dashboardItems,
  dashboardItem,
  initTitle,
  devices,
  onSave,
}: TBaseWidgetSettingsFormProps) => {
  const { t, token } = useApp();

  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const [selectedDevice, setSelectedDevice] = useState<TDevice>();
  const [previewValue, setPreviewValue] = useState<any>();
  const [isValid, setIsValid] = useState(true);

  const previewWidget = useMemo(() => {
    const widget = FULL_ATTRIBUTES_WIDGETS[dashboardItem.type];
    return {
      ...widget,
      properties: formValues,
    };
  }, [dashboardItem.type, formValues]);

  const onFinishForm = (data: any) => {
    const foundItem = dashboardItems.find(
      (item) => item.layout.i === dashboardItem.layout.i,
    );

    if (!foundItem) {
      dashboardItems.push({
        ...dashboardItem,
        properties: data,
      });
    } else {
      foundItem.properties = data;
      dashboardItems = dashboardItems.map((item) =>
        item.layout.i === dashboardItem.layout.i ? foundItem : item,
      );
    }

    onSave(dashboardItems);

    setOpen(false);
  };

  useEffect(() => {
    const device = devices.find((x) => x.id === formValues?.deviceId);
    setSelectedDevice(device);
    form.setFieldValue('color', device?.color || '#ffffffff');
  }, [dashboardItem.type, devices, form, formValues?.deviceId]);

  useEffect(() => {
    setPreviewValue(
      selectedDevice?.defaultValue ||
        FULL_ATTRIBUTES_WIDGETS[dashboardItem.type].defaultProperties?.value,
    );
  }, [dashboardItem.type, selectedDevice?.defaultValue]);

  useEffect(() => {
    form.setFieldsValue({
      title: initTitle,
      ...dashboardItem.properties,
    });
  }, [dashboardItem.properties, form, initTitle]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then((formValues) => {
        setIsValid(!!Object.values(formValues).length);
      })
      .catch(() => {
        setIsValid(false);
      });
  }, [form, formValues]);

  return (
    <Modal
      title={t('Settings')}
      width={1000}
      open={open}
      okText={t('Save')}
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
      okButtonProps={{
        disabled: !isValid,
      }}
    >
      <Row
        css={css`
          margin-top: ${token.marginXL}px;
        `}
      >
        <Col span={12}>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinishForm}
            validateTrigger="onChange"
          >
            <Form.Item
              name="title"
              label={t('Title')}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="deviceId" label={t('Device')} required>
              <Select>
                {devices
                  .filter((x) => {
                    const w = FULL_ATTRIBUTES_WIDGETS[dashboardItem.type];

                    return (
                      w.validDeviceTypes.includes(
                        `${x.type}_${x.mode || ''}_${
                          x.dataType || x.pin
                        }` as TValidDeviceType,
                      ) ||
                      w.validDeviceTypes.includes(`${x.type}__${x.pin}` as any)
                    );
                  })
                  .map((device) => {
                    return (
                      <Select.Option key={device.id} value={device.id}>
                        <Flex justify="space-between">
                          <span
                            css={css`
                              font-weight: ${token.fontWeightStrong};
                            `}
                          >
                            {device.name}
                          </span>
                          <div>
                            ({device.gateway?.name}/
                            <span
                              css={css`
                                font-weight: ${token.fontWeightStrong};
                              `}
                            >
                              {device.pin}
                            </span>
                            )
                          </div>
                        </Flex>
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Divider />

            {FULL_ATTRIBUTES_WIDGETS[dashboardItem.type].propertiesFields.map(
              (field, index) => (
                <Form.Item
                  key={index}
                  name={field.name}
                  label={t(field.label as any)}
                  rules={[{ required: field.required }]}
                >
                  {field.type === 'input' ? (
                    <Input />
                  ) : field.type === 'input-number' ? (
                    <InputNumber />
                  ) : field.type === 'slider' ? (
                    <Slider />
                  ) : field.type === 'switch' ? (
                    <Switch />
                  ) : field.type === 'color-picker' ? (
                    <ColorPicker
                      disabledAlpha
                      value={formValues?.[field.name]}
                      onChangeComplete={(color) => {
                        form.setFieldValue(field.name, color.toHexString());
                      }}
                    />
                  ) : null}
                </Form.Item>
              ),
            )}

            <DevTool />
          </Form>
        </Col>

        <Col span={1} />

        <Col
          span={11}
          css={css`
            background-color: ${token.colorBgLayout};
            padding: ${token.padding}px;
            border-radius: ${token.borderRadius}px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <Flex
            justify="center"
            css={css`
              min-width: 200px;
            `}
          >
            <BaseDashboardItem
              $token={token}
              css={css`
                width: 100%;
              `}
            >
              <previewWidget.Widget
                context="preview"
                value={previewValue}
                onChange={setPreviewValue}
                properties={previewWidget.properties}
                device={selectedDevice}
              />
            </BaseDashboardItem>
          </Flex>
        </Col>
      </Row>
    </Modal>
  );
};

export default BaseWidgetSettingsModal;
