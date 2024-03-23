import { BlockOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Col, FloatButton, Row, Space, Typography } from 'antd';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import {
  BaseDashboardItem,
  TopLayerEdit,
} from '@/modules/projects/components/dashboard-item';
import {
  FULL_ATTRIBUTES_WIDGETS,
  TDashboardItem,
  TWidgetCommon,
  TWidgetType,
} from '@/modules/projects/components/widgets';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import projectService from '@/modules/projects/project.service';
import { THttpResponse } from '@/shared/http-service';
import { TST } from '@/shared/types/tst.type';
import { transApiResDataCode } from '@/shared/utils';

const GridLayout = WidthProvider(RGL);

export const Route = createFileRoute(
  '/_app/projects/_$projectId/dashboard/edit',
)({
  component: ProjectIdEditDashboard,
});

const DEFAULT_ROW_NUM = 5;
const NUMBER_OF_COLUMNS = 24;
const ITEM_UNIT_HEIGHT = 96;
const MARGIN_DASHBOARD = 8;

function ProjectIdEditDashboard() {
  const { projectId } = Route.useParams();

  const navigate = useNavigate();

  const { t, token, antdApp } = useApp();

  const setLoading = useAppStore((state) => state.setLoading);

  const { project, datastreams, projectQuery } = useGetProjectDetail(projectId);
  const webDashboard = project?.webDashboard;

  const [items, setItems] = useState<TDashboardItem[]>([]);
  const [droppingItem, setDroppingItem] = useState<TWidgetCommon>();
  const [curRowNum, setCurRowNum] = useState<number>(DEFAULT_ROW_NUM);

  const updateWebDashboard = useMutation({
    mutationFn: (webDashboard: TDashboardItem[]) =>
      projectService.updateWebDashboard(projectId, {
        webDashboard,
      }),
    onError: (error: AxiosError<THttpResponse<null>>) =>
      antdApp.notification.error({
        message: t('Error'),
        description: transApiResDataCode(t, error.response?.data),
      }),
    onSuccess: () => antdApp.message.success(t('Updated successfully')),
  });

  useEffect(() => {
    setCurRowNum(() =>
      Math.max(
        DEFAULT_ROW_NUM,
        ...items.map((item) => item.layout.y + item.layout.h),
      ),
    );
  }, [items]);

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
      <Row gutter={token.size}>
        <Col span={4}>
          <ListWidgetLayout $token={token} direction="vertical" size="middle">
            <Space align="center" size="large">
              <BlockOutlined style={{ fontSize: token.fontSizeHeading5 }} />
              <Typography.Text style={{ fontSize: token.fontSizeHeading4 }}>
                {t('Widgets')}
              </Typography.Text>
            </Space>

            {Object.keys(FULL_ATTRIBUTES_WIDGETS).map((widgetType) => {
              const widget = FULL_ATTRIBUTES_WIDGETS[widgetType as TWidgetType];

              return (
                <BaseDashboardItem
                  style={{ cursor: 'grab' }}
                  $token={token}
                  className="droppable-element"
                  key={widgetType}
                  draggable
                  onDragStart={() => setDroppingItem(widget)}
                  onDragEnd={() => setDroppingItem(undefined)}
                >
                  <widget.Widget />
                </BaseDashboardItem>
              );
            })}
          </ListWidgetLayout>
        </Col>

        <Col span={20}>
          <DashboardLayout
            $token={token}
            style={{
              height:
                curRowNum * ITEM_UNIT_HEIGHT +
                MARGIN_DASHBOARD * (curRowNum + 1.5),
            }}
          >
            <DashboardBoxRow $token={token}>
              {new Array(24 * curRowNum).fill(0).map((_, index) => {
                return (
                  <DashboardBoxCol key={index} $token={token}>
                    <DashboardBox $token={token}></DashboardBox>
                  </DashboardBoxCol>
                );
              })}
            </DashboardBoxRow>

            <GridLayout
              style={{ height: '100%' }}
              className="layout"
              compactType={null}
              cols={NUMBER_OF_COLUMNS}
              rowHeight={ITEM_UNIT_HEIGHT}
              isDroppable={true}
              droppingItem={droppingItem?.layoutSettings}
              margin={[MARGIN_DASHBOARD, MARGIN_DASHBOARD]}
              onLayoutChange={(layout) => {
                setItems((prev) =>
                  prev.map((item) => {
                    const newItem = layout.find((l) => l.i === item.layout.i);

                    if (!newItem) return item;

                    return {
                      ...item,
                      layout: newItem,
                    };
                  }),
                );
              }}
              onDrop={(_layout, item) => {
                if (!droppingItem) return;

                if (item.y + droppingItem.layoutSettings.h > curRowNum) {
                  setCurRowNum(item.y + droppingItem.layoutSettings.h);
                }

                setItems((prev) => [
                  {
                    type: droppingItem.type,
                    properties: {
                      title: `${droppingItem?.type}-${prev.length}`,
                    },
                    layout: {
                      ...item,
                      i: `${droppingItem?.type}-${prev.length}`,
                    },
                  },
                  ...prev,
                ]);
              }}
            >
              {items.map((item) => {
                const widget = FULL_ATTRIBUTES_WIDGETS[item.type];

                if (!widget) return null;

                return (
                  <BaseDashboardItem
                    key={item.layout.i}
                    $editing
                    $token={token}
                    className="droppable-element"
                    data-grid={{
                      ...item.layout,
                      minW: widget.layoutSettings.minW,
                      maxW: widget.layoutSettings.maxW,
                      minH: widget.layoutSettings.minH,
                      maxH: widget.layoutSettings.maxH,
                    }}
                  >
                    <TopLayerEdit
                      webDashboard={items}
                      dashboardItem={item}
                      datastreams={datastreams}
                      onSave={(webDashboard) => {
                        setItems(webDashboard);
                      }}
                    >
                      <widget.Widget properties={item.properties} />
                    </TopLayerEdit>
                  </BaseDashboardItem>
                );
              })}
            </GridLayout>
          </DashboardLayout>
        </Col>
      </Row>

      <FloatButton.Group>
        <FloatButton
          icon={<LeftOutlined />}
          tooltip={t('Go back')}
          onClick={() =>
            navigate({
              to: '/projects/$projectId/dashboard',
              params: { projectId },
            })
          }
        />

        <FloatButton
          icon={<SaveOutlined />}
          tooltip={t('Save')}
          type="primary"
          onClick={() => updateWebDashboard.mutate(items)}
        />
      </FloatButton.Group>
    </>
  );
}

const ListWidgetLayout = styled(Space)<TST>`
  padding: ${({ $token }) => $token.paddingXS}px;
  border-radius: ${({ $token }) => $token.borderRadius}px;
  background-color: ${({ $token }) => $token.colorBgLayout};
  height: calc(100vh - 275px);
  width: 100%;
`;

const DashboardLayout = styled.div<TST>`
  background-color: ${({ $token }) => $token.colorBgContainer};
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px dashed ${({ $token }) => $token.colorBorder};
  position: relative;
  overflow-y: hidden;
  max-height: calc(100vh - 275px);
  overflow-y: scroll;
  width: '100%';
`;

const DashboardBoxRow = styled.div<TST>`
  padding: ${({ $token }) => $token.paddingXS}px;
  margin: 0 !important;
  border-radius: ${({ $token }) => $token.borderRadius}px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 8px;
`;

const DashboardBoxCol = styled.div<TST>`
  border-radius: ${({ $token }) => $token.borderRadius}px;
  padding: ${({ $token }) => $token.sizeXXS};
  height: 96px;
`;

const DashboardBox = styled.div<TST>`
  background-color: ${({ $token }) => $token.colorBgLayout};
  height: 100%;
  width: 100%;
  border-radius: ${({ $token }) => $token.borderRadius}px;
`;
