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
import { TDatastream } from '@/modules/datastreams/datastream.model';

import {
  FULL_ATTRIBUTES_WIDGETS,
  TDashboardItem,
  TValidDatastreamType,
} from '.';
import { BaseDashboardItem } from '../dashboard-item';

type TBaseWidgetSettingsFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  webDashboard: TDashboardItem[];
  dashboardItem: TDashboardItem;
  initTitle?: string;
  datastreams: TDatastream[];
  onSave: (webDashboard: TDashboardItem[]) => void;
};

function BaseWidgetSettingsModal({
  open,
  setOpen,
  webDashboard,
  dashboardItem,
  initTitle,
  datastreams,
  onSave,
}: TBaseWidgetSettingsFormProps) {
  const { t, token } = useApp();

  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const [selectedDatastream, setSelectedDatastream] = useState<TDatastream>();
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
    const foundItem = webDashboard.find(
      (item) => item.layout.i === dashboardItem.layout.i,
    );

    if (!foundItem) {
      webDashboard.push({
        ...dashboardItem,
        properties: data,
      });
    } else {
      foundItem.properties = data;
      webDashboard = webDashboard.map((item) =>
        item.layout.i === dashboardItem.layout.i ? foundItem : item,
      );
    }

    onSave(webDashboard);

    setOpen(false);
  };

  useEffect(() => {
    const datastream = datastreams.find(
      (x) => x.id === formValues?.datastreamId,
    );
    setSelectedDatastream(datastream);
    form.setFieldValue('color', datastream?.color || '#ffffffff');
  }, [dashboardItem.type, datastreams, form, formValues?.datastreamId]);

  useEffect(() => {
    setPreviewValue(
      selectedDatastream?.defaultValue ||
        FULL_ATTRIBUTES_WIDGETS[dashboardItem.type].defaultProperties?.value,
    );
  }, [dashboardItem.type, selectedDatastream?.defaultValue]);

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

            <Form.Item name="datastreamId" label={t('Datastream')} required>
              <Select>
                {datastreams
                  .filter((x) =>
                    FULL_ATTRIBUTES_WIDGETS[
                      dashboardItem.type
                    ].validDatastreamTypes.includes(
                      `${x.type}_${x.mode || ''}_${
                        x.dataType
                      }` as TValidDatastreamType,
                    ),
                  )
                  .map((datastream) => (
                    <Select.Option key={datastream.id} value={datastream.id}>
                      <Flex justify="space-between">
                        <span
                          css={css`
                            font-weight: ${token.fontWeightStrong};
                          `}
                        >
                          {datastream.name}
                        </span>
                        <div>
                          ({datastream.device?.name}/
                          <span
                            css={css`
                              font-weight: ${token.fontWeightStrong};
                            `}
                          >
                            {datastream.pin}
                          </span>
                          )
                        </div>
                      </Flex>
                    </Select.Option>
                  ))}
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
                value={previewValue}
                onChange={setPreviewValue}
                properties={previewWidget.properties}
                datastream={selectedDatastream}
              />
            </BaseDashboardItem>
          </Flex>
        </Col>
      </Row>
    </Modal>
  );
}

export default BaseWidgetSettingsModal;
