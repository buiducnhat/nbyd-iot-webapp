import { EditOutlined } from '@ant-design/icons';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FloatButton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
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

  const { project, datastreams, projectQuery } = useGetProjectDetail(projectId);
  const webDashboard = project?.webDashboard;

  const [items, setItems] = useState<TDashboardItem[]>([]);

  const maxY = useMemo(
    () =>
      Math.max(
        DEFAULT_ROW_NUM,
        ...items.map((item) => item.layout.y + item.layout.h),
      ),
    [items],
  );

  useEffect(() => {
    projectQuery.isFetching ? setLoading(true) : setLoading(false);
  }, [projectQuery.isFetching, setLoading]);

  useEffect(() => {
    if (webDashboard) {
      setItems(webDashboard);
    }
  }, [webDashboard]);

  return (
    <>
      <DashboardLayout
        $token={token}
        style={{
          height: maxY * ITEM_UNIT_HEIGHT + MARGIN_DASHBOARD * (maxY + 1.5),
        }}
      >
        <GridLayout
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
