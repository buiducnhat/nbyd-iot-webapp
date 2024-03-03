import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import { TST } from '@/shared/types/tst.type';

import SliderSettingsModal from './widgets/switch/settings';

export const BaseDashboardItem = styled.div<TST>`
  cursor: move;
  min-height: 96px;
  border-radius: ${({ token }) => token.borderRadius}px;
  background-color: ${({ token }) => token.colorBgElevated};
  box-shadow: ${({ token }) => token.boxShadow};
`;

export function EditableDashboardItem({ children }: { children: ReactNode }) {
  const { t, token } = useApp();

  const [hover, setHover] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsChildren, setSettingsChildren] = useState<ReactNode>();

  return (
    <>
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div onMouseDown={(e) => e.stopPropagation()}>
          <Modal
            title={t('Settings')}
            width={1000}
            open={openSettings}
            onCancel={() => setOpenSettings(false)}
            footer={null}
          >
            {settingsChildren}
          </Modal>
        </div>

        {hover && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `${token.colorBgElevated}75`,
              zIndex: 1,
            }}
          />
        )}

        {hover && (
          <Space.Compact
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 3,
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
                setSettingsChildren(<SliderSettingsModal />);
              }}
            />
            <Button
              style={{ borderColor: token.colorError }}
              icon={<DeleteOutlined style={{ color: token.colorError }} />}
            />
          </Space.Compact>
        )}

        {children}
      </div>
    </>
  );
}
