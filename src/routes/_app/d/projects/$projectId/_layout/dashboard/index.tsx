import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FloatButton } from 'antd';
import { MacScrollbar } from 'mac-scrollbar';
import { useEffect, useMemo, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import { socket } from '@/modules/app/socket-io';
import useGetListDevice from '@/modules/devices/hooks/use-get-list-device';
import BaseDashboardItem from '@/modules/projects/components/base-dashboard-item';
import DragableTabs from '@/modules/projects/components/dragable-tabs';
import { FULL_ATTRIBUTES_WIDGETS } from '@/modules/projects/components/widgets';
import { TSocketDevicCommandDto } from '@/modules/projects/dto/socket-gateway-command.dto';
import { TSocketGatewayDataDto } from '@/modules/projects/dto/socket-gateway-data.dto';
import { TSocketJoinRoomDto } from '@/modules/projects/dto/socket-join-room.dto';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import { TAntdToken } from '@/shared/types/tst.type';
import { isDefined } from '@/shared/utils';

const GridLayout = WidthProvider(RGL);

export const Route = createFileRoute(
  '/_app/d/projects/$projectId/_layout/dashboard/',
)({
  component: ProjectIdDashboard,
});

const DEFAULT_ROW_NUM = 7;
const NUMBER_OF_COLUMNS = 24;
const ITEM_UNIT_HEIGHT = 96;
const MARGIN_DASHBOARD = 8;

function ProjectIdDashboard() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  const { t, token } = useApp();

  const connectedSocket = useAppStore((state) => state.connectedSocket);

  const { project } = useGetProjectDetail(projectId);
  const { devices } = useGetListDevice(projectId, true);

  const [deviceValues, setDeviceValues] = useState<{
    [deviceId: string]: any;
  }>({});
  const [activeTabKey, setActiveTabKey] = useState<string>('');

  const items = useMemo(
    () =>
      project?.webDashboard?.find((x) => x.key === activeTabKey)?.content ?? [],
    [activeTabKey, project?.webDashboard],
  );

  const maxY = useMemo(
    () =>
      Math.max(
        DEFAULT_ROW_NUM,
        ...items.map((item) => item.layout.y + item.layout.h),
      ),
    [items],
  );

  useEffect(() => {
    if (devices) {
      setDeviceValues(
        devices.reduce((prev: { [deviceId: string]: any }, curr) => {
          prev[curr.id] = curr.values?.[0]?.value ?? curr.defaultValue ?? '';
          return prev;
        }, {}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(devices)]);

  useEffect(() => {
    if (project?.webDashboard) {
      setActiveTabKey(project?.webDashboard?.[0]?.key);
    }
  }, [project?.webDashboard]);

  useEffect(() => {
    if (connectedSocket) {
      socket.emit('/ws-room/projects/join', {
        projectId,
      } as TSocketJoinRoomDto);

      socket.on('/devices/data', (data: TSocketGatewayDataDto) => {
        setDeviceValues((prev) => ({ ...prev, [data.deviceId]: data.value }));
      });

      return () => {
        socket.emit('/ws-room/projects/leave', {
          projectId,
        } as TSocketJoinRoomDto);

        socket.off('/devices/data');
      };
    }
  }, [projectId, connectedSocket]);

  return (
    <>
      <MacScrollbar>
        <DragableTabs
          viewMode
          tabs={project?.webDashboard || []}
          setTabs={() => null}
          activeKey={activeTabKey}
          setActiveKey={setActiveTabKey}
        />

        <DashboardLayout
          $token={token}
          css={css`
            height: ${maxY * ITEM_UNIT_HEIGHT +
            MARGIN_DASHBOARD * (maxY + 1.5)}px;
          `}
        >
          <GridLayout
            css={css`
              height: 100%;
            `}
            className="layout"
            compactType={null}
            cols={NUMBER_OF_COLUMNS}
            rowHeight={ITEM_UNIT_HEIGHT}
            margin={[MARGIN_DASHBOARD, MARGIN_DASHBOARD]}
          >
            {items.map((item) => {
              const widget = FULL_ATTRIBUTES_WIDGETS[item.type];

              if (!widget) return null;

              const device = devices.find(
                (x) => x.id === item.properties.deviceId,
              );

              return (
                <BaseDashboardItem
                  key={item.layout.i}
                  $token={token}
                  className="droppable-element"
                  data-grid={{
                    ...item.layout,
                    static: true,
                    isDraggable: false,
                    isResizable: false,
                  }}
                  draggable={false}
                >
                  <widget.Widget
                    properties={item.properties}
                    defaultProperties={widget.defaultProperties}
                    device={device}
                    value={
                      device
                        ? deviceValues[device.id]
                        : widget.defaultProperties.value
                    }
                    onChange={(value) => {
                      if (device) {
                        if (connectedSocket && isDefined(value)) {
                          socket.emit('/devices/command', {
                            projectId,
                            gatewayId: device?.gatewayId,
                            deviceId: device?.id,
                            value,
                          } as TSocketDevicCommandDto);
                        }
                        setDeviceValues((prev) => ({
                          ...prev,
                          [device.id]: value,
                        }));
                      }
                    }}
                  />
                </BaseDashboardItem>
              );
            })}
          </GridLayout>
        </DashboardLayout>
      </MacScrollbar>

      <FloatButton
        icon={<EditOutlined />}
        tooltip={t('Edit') + ' ' + t('Dashboard')}
        type="primary"
        onClick={() =>
          navigate({
            to: '/d/projects/$projectId/dashboard/edit',
            params: { projectId },
          })
        }
      />
    </>
  );
}

const DashboardLayout = styled.div<TAntdToken>`
  background-color: ${({ $token }) => $token.colorBgContainer};
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px dashed ${({ $token }) => $token.colorBorder};
  position: relative;
  max-height: calc(100dvh - 330px);
  overflow-y: auto;
  width: 100%;
`;
