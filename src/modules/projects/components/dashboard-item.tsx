import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Space } from 'antd';
import { ReactNode, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TDevice } from '@/modules/devices/device.model';
import { TAntdToken } from '@/shared/types/tst.type';

import { TDashboardItem } from './widgets';
import BaseWidgetSettingsModal from './widgets/base-widget-settings-form';

export const BaseDashboardItem = styled.div<
  TAntdToken & { $editing?: boolean }
>`
  cursor: ${({ $editing }) => ($editing ? 'move' : 'default')};
  min-height: 96px;
  border-radius: ${({ $token }) => $token.borderRadius}px;
  background-color: ${({ $token }) => $token.colorBgElevated};
  box-shadow: 0px 0px 15px 0px #00000025;
  padding: ${({ $token, $editing }) => ($editing ? 0 : $token.padding)}px;
`;

const TopLayer = styled.div<TAntdToken>`
  position: relative;
  height: 100%;
  width: 100%;
  padding: ${({ $token }) => $token.padding}px;
  padding-top: ${({ $token }) => $token.paddingXS}px;
`;

type TTopLayerEditProps = {
  webDashboard: TDashboardItem[];
  dashboardItem: TDashboardItem;
  devices: TDevice[];
  children: ReactNode;
  onSave: (webDashboard: TDashboardItem[]) => void;
};

export function TopLayerEdit({
  webDashboard,
  dashboardItem,
  devices,
  onSave,
  children,
}: TTopLayerEditProps) {
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
          webDashboard={webDashboard}
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
                webDashboard.filter(
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
}
