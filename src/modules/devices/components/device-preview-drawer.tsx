import { Button, Descriptions, Drawer, Skeleton, Space, Tag } from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';
import useDeviceSize from '@/hooks/use-device-size';

import {
  EDeviceDataType,
  EDeviceMode,
  EDeviceType,
  TDevice,
} from '../device.model';
import { DeviceDataTypeTag, DeviceModeTag, DeviceTypeTag } from './device-tags';

type TDevicePreviewDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  device?: TDevice;
};

const DevicePreviewDrawer: React.FC<TDevicePreviewDrawerProps> = ({
  open,
  setOpen,
  device,
}: TDevicePreviewDrawerProps) => {
  const { t } = useApp();

  const { isMobile } = useDeviceSize();

  return (
    <Drawer
      title={t('Preview')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {!device ? (
        <Skeleton active />
      ) : (
        <Descriptions
          column={isMobile ? 1 : 2}
          title={device.name}
          items={[
            {
              label: t('ID'),
              span: 1,
              children: device.id,
            },
            {
              label: t('Gateway'),
              span: 1,
              children: device.gateway?.name,
            },
            {
              label: t('Type'),
              span: 1,
              children: (
                <Space direction="vertical">
                  <DeviceTypeTag type={device.type} />
                  {device.type === EDeviceType.ZIGBEE && (
                    <Tag>{device.mac}</Tag>
                  )}
                </Space>
              ),
            },
            {
              label: t('Pin/Zigbee Type'),
              span: 1,
              children: <Tag color={device.color}>{device.pin}</Tag>,
            },
            {
              label: t('Mode'),
              span: 1,
              children: <DeviceModeTag mode={device.mode as EDeviceMode} />,
            },
            {
              label: t('Data type'),
              span: 1,
              children: (
                <DeviceDataTypeTag
                  dataType={device.dataType as EDeviceDataType}
                />
              ),
            },
            {
              label: t('Unit'),
              span: 1,
              children: device.unit,
            },
            {
              label: t('Min value'),
              span: 1,
              children: device.minValue,
            },
            {
              label: t('Max value'),
              span: 1,
              children: device.maxValue,
            },
            {
              label: t('Default value'),
              span: 1,
              children: device.defaultValue,
            },
            {
              label: t('History'),
              span: 1,
              children: (
                <Tag color={device.enabledHistory ? 'green' : 'gold'}>
                  {device.enabledHistory ? t('Yes') : t('No')}
                </Tag>
              ),
            },
            {
              label: t('Created at'),
              span: 1,
              children: dayjs(device.createdAt).format('YYYY/MM/DD - HH:mm:ss'),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default DevicePreviewDrawer;
