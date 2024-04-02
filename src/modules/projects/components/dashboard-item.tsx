import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Space } from 'antd';
import { ReactNode, useState } from 'react';

import useApp from '@/hooks/use-app';
import { TDatastream } from '@/modules/datastreams/datastream.model';
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

type TTopLayerEditProps = {
  webDashboard: TDashboardItem[];
  dashboardItem: TDashboardItem;
  datastreams: TDatastream[];
  children: ReactNode;
  onSave: (webDashboard: TDashboardItem[]) => void;
};

export function TopLayerEdit({
  webDashboard,
  dashboardItem,
  datastreams,
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
          datastreams={datastreams}
          webDashboard={webDashboard}
          dashboardItem={dashboardItem}
          onSave={onSave}
        />
      </div>

      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `${token.colorBgElevated}bf`,
            zIndex: 10,
          }}
        />
      )}

      {hover && (
        <Space.Compact
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 11,
            padding: token.sizeXS,
            transition: token.motionEaseInOut,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Button
            style={{ borderColor: token.colorPrimary }}
            icon={<SettingOutlined style={{ color: token.colorPrimary }} />}
            onClick={() => {
              setOpenSettings(true);
            }}
          />
          <Button
            style={{ borderColor: token.colorError }}
            icon={<DeleteOutlined style={{ color: token.colorError }} />}
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

const TopLayer = styled.div<TAntdToken>`
  position: relative;
  height: 100%;
  width: 100%;
  padding: ${({ $token }) => $token.padding}px;
`;
