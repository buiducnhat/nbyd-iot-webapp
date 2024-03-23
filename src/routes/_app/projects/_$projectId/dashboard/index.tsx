import { EditOutlined } from '@ant-design/icons';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FloatButton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import { socket } from '@/modules/app/socket-io';
import { BaseDashboardItem } from '@/modules/projects/components/dashboard-item';
import {
  FULL_ATTRIBUTES_WIDGETS,
  TDashboardItem,
} from '@/modules/projects/components/widgets';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import { TST } from '@/shared/types/tst.type';

const GridLayout = WidthProvider(RGL);

export const Route = createFileRoute('/_app/projects/_$projectId/dashboard/')({
  component: ProjectIdDashboard,
});

const DEFAULT_ROW_NUM = 5;
const NUMBER_OF_COLUMNS = 24;
const ITEM_UNIT_HEIGHT = 96;
const MARGIN_DASHBOARD = 8;

function ProjectIdDashboard() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();

  const { t, token } = useApp();

  const setLoading = useAppStore((state) => state.setLoading);
  const connectedSocket = useAppStore((state) => state.connectedSocket);

  const { project, datastreams, projectQuery } = useGetProjectDetail(projectId);

  const [items, setItems] = useState<TDashboardItem[]>([]);
  const [dsValues, setDsValues] = useState<{ [datastreamId: string]: string }>(
    {},
  );

  const webDashboard = project?.webDashboard;

  const maxY = useMemo(
    () =>
      Math.max(
        DEFAULT_ROW_NUM,
        ...items.map((item) => item.layout.y + item.layout.h),
      ),
    [items],
  );

  useEffect(() => {
    if (datastreams) {
      setDsValues(
        datastreams.reduce((prev: { [datastreamId: string]: string }, curr) => {
          prev[curr.id] = curr.lastValue;
          return prev;
        }, {}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(datastreams)]);

  useEffect(() => {
    projectQuery.isFetching ? setLoading(true) : setLoading(false);
  }, [projectQuery.isFetching, setLoading]);

  useEffect(() => {
    if (webDashboard) {
      setItems(webDashboard);
    }
  }, [webDashboard]);

  useEffect(() => {
    if (connectedSocket) {
      socket.emit('/ws-room/projects/join', {
        projectId,
      });

      socket.on(
        '/devices/data',
        (data: { datastreamId: string; value: string }) => {
          setDsValues((prev) => ({ ...prev, [data.datastreamId]: data.value }));
        },
      );

      return () => {
        socket.emit('/ws-room/projects/leave', {
          projectId,
        });

        socket.off('/devices/data');
      };
    }
  }, [projectId, connectedSocket]);

  return (
    <>
      <DashboardLayout
        $token={token}
        style={{
          height: maxY * ITEM_UNIT_HEIGHT + MARGIN_DASHBOARD * (maxY + 1.5),
        }}
      >
        <GridLayout
          style={{ height: '100%' }}
          className="layout"
          compactType={null}
          cols={NUMBER_OF_COLUMNS}
          rowHeight={ITEM_UNIT_HEIGHT}
          margin={[MARGIN_DASHBOARD, MARGIN_DASHBOARD]}
        >
          {items.map((item) => {
            const widget = FULL_ATTRIBUTES_WIDGETS[item.type];

            if (!widget) return null;

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
                  datastream={datastreams.find(
                    (x) => x.id === item.properties.datastreamId,
                  )}
                  value={
                    widget.dataType === 'number'
                      ? Number(dsValues[item.properties.datastreamId])
                      : String(dsValues[item.properties.datastreamId])
                  }
                  onChange={(value) => {
                    if (connectedSocket) {
                      socket.emit('/devices/command', {
                        datastreamId: item.properties.datastreamId,
                        value: String(value),
                      });
                    }
                    setDsValues((prev) => ({
                      ...prev,
                      [item.properties.datastreamId]: String(value),
                    }));
                  }}
                />
              </BaseDashboardItem>
            );
          })}
        </GridLayout>
      </DashboardLayout>

      <FloatButton
        icon={<EditOutlined />}
        tooltip={t('Edit') + ' ' + t('Dashboard')}
        type="primary"
        onClick={() =>
          navigate({
            to: '/projects/$projectId/dashboard/edit',
            params: { projectId },
          })
        }
      />
    </>
  );
}

const DashboardLayout = styled.div<TST>`
  background-color: ${({ $token }) => $token.colorBgContainer};
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px dashed ${({ $token }) => $token.colorBorder};
  position: relative;
  max-height: calc(100vh - 275px);
  overflow-y: scroll;
  width: 100%;
`;
