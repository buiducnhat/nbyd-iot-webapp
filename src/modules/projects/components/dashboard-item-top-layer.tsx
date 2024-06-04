import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Space } from 'antd';
import { ReactNode, useRef, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TDevice } from '@/modules/devices/device.model';
import { TAntdToken } from '@/shared/types/tst.type';

import { TDashboardItem } from './widgets';
import BaseWidgetSettingsDrawer from './widgets/base-widget-settings-drawer';
import BaseWidgetSettingsModal from './widgets/base-widget-settings-modal';

const TopLayer = styled.div<TAntdToken>`
  position: relative;
  height: 100%;
  width: 100%;
  padding: ${({ $token }) => $token.paddingXS}px;
`;

type TTopLayerEditProps = {
  dashboardItems: TDashboardItem[];
  dashboardItem: TDashboardItem;
  devices: TDevice[];
  children: ReactNode;
  onSave: (dashboardItems: TDashboardItem[]) => void;
};

export const TopLayerEdit = ({
  dashboardItems,
  dashboardItem,
  devices,
  onSave,
  children,
}: TTopLayerEditProps) => {
  const { token } = useApp();

  const [hover, setHover] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <TopLayer
      $token={token}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <BaseWidgetSettingsModal
          open={openSettings}
          setOpen={setOpenSettings}
          devices={devices}
          dashboardItems={dashboardItems}
          dashboardItem={dashboardItem}
          onSave={onSave}
        />
      </div>

      {hover && (
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${token.colorBgElevated}bf;
            z-index: 10;
          `}
        />
      )}

      {hover && (
        <Space.Compact
          css={css`
            position: absolute;
            top: 0;
            right: 0;
            z-index: 11;
            padding: ${token.sizeXS}px;
            transition: ${token.motionEaseInOut};
          `}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Button
            css={css`
              border-color: ${token.colorPrimary};
            `}
            icon={
              <SettingOutlined
                css={css`
                  color: ${token.colorPrimary};
                `}
              />
            }
            onClick={() => {
              setOpenSettings(true);
            }}
          />
          <Button
            danger
            icon={
              <DeleteOutlined
                css={css`
                  color: ${token.colorError};
                `}
              />
            }
            onClick={() => {
              onSave(
                dashboardItems.filter(
                  (item) => item.layout.i !== dashboardItem.layout.i,
                ),
              );
            }}
          />
        </Space.Compact>
      )}

      {children}
    </TopLayer>
  );
};

export const MTopLayerEdit = ({
  dashboardItems,
  dashboardItem,
  devices,
  onSave,
  children,
}: TTopLayerEditProps) => {
  const { token } = useApp();

  const [openSettings, setOpenSettings] = useState(false);

  const [holdTime, setHoldTime] = useState(0);
  const [oldPosition, setOldPosition] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <TopLayer
      ref={ref}
      $token={token}
      onTouchStart={() => {
        setHoldTime(Date.now());
        setOldPosition({
          x: ref.current?.getBoundingClientRect().x || 0,
          y: ref.current?.getBoundingClientRect().y || 0,
        });
      }}
      onTouchEnd={() => {
        if (
          Date.now() - holdTime > 500 &&
          oldPosition.x === ref.current?.getBoundingClientRect().x &&
          oldPosition.y === ref.current?.getBoundingClientRect().y
        ) {
          setOpenSettings(true);
        }
      }}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <BaseWidgetSettingsDrawer
          open={openSettings}
          setOpen={setOpenSettings}
          devices={devices}
          dashboardItems={dashboardItems}
          dashboardItem={dashboardItem}
          onSave={onSave}
          onDelete={() => {
            onSave(
              dashboardItems.filter(
                (item) => item.layout.i !== dashboardItem.layout.i,
              ),
            );
          }}
        />
      </div>

      {children}
    </TopLayer>
  );
};
