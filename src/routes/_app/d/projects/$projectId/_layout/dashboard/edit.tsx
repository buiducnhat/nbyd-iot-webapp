import { BlockOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Col, FloatButton, Row, Space, Typography } from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import * as uuid from 'uuid';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import useGetListDevice from '@/modules/devices/hooks/use-get-list-device';
import BaseDashboardItem from '@/modules/projects/components/base-dashboard-item';
import { TopLayerEdit } from '@/modules/projects/components/dashboard-item-top-layer';
import DragableTabs from '@/modules/projects/components/dragable-tabs';
import {
  FULL_ATTRIBUTES_WIDGETS,
  TDashboardItem,
  TWidgetCommon,
  TWidgetType,
} from '@/modules/projects/components/widgets';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import { TWebDashboardTab } from '@/modules/projects/project.model';
import projectService from '@/modules/projects/project.service';
import { THttpResponse } from '@/shared/http-service';
import { TAntdToken } from '@/shared/types/tst.type';
import { styledOmit$PropsOptions, transApiResDataCode } from '@/shared/utils';

const GridLayout = WidthProvider(RGL);

export const Route = createFileRoute(
  '/_app/d/projects/$projectId/_layout/dashboard/edit',
)({
  component: ProjectIdEditDashboard,
});

const DEFAULT_ROW_NUM = 7;
const NUMBER_OF_COLUMNS = 24;
const ITEM_UNIT_HEIGHT = 96;
const MARGIN_DASHBOARD = 8;

function ProjectIdEditDashboard() {
  const { projectId } = Route.useParams();

  const navigate = useNavigate();

  const { t, token, antdApp } = useApp();

  const setLoading = useAppStore((state) => state.setLoading);

  const { project, projectQuery } = useGetProjectDetail(projectId);
  const { devices } = useGetListDevice(projectId);

  const [dashboardTabs, setDashboardTabs] = useState<TWebDashboardTab[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>('');
  const [droppingItem, setDroppingItem] = useState<TWidgetCommon>();
  const [curRowNum, setCurRowNum] = useState<number>(DEFAULT_ROW_NUM);

  const updateWebDashboard = useMutation({
    mutationFn: (webDashboard: TWebDashboardTab[]) =>
      projectService.updateDashboard(projectId, {
        webDashboard: webDashboard,
      }),
    onError: (error: AxiosError<THttpResponse<null>>) =>
      antdApp.notification.error({
        message: t('Error'),
        description: transApiResDataCode(t, error.response?.data),
      }),
    onSuccess: () => antdApp.message.success(t('Updated successfully')),
  });

  const dashboardItems = useMemo(
    () => dashboardTabs.find((tab) => tab.key === activeTabKey)?.content ?? [],
    [activeTabKey, dashboardTabs],
  );

  const setDashboardItems = useCallback(
    (items: TDashboardItem[]) => {
      setDashboardTabs((prev) =>
        prev.map((tab) => {
          if (tab.key !== activeTabKey) return tab;

          return {
            ...tab,
            content: items,
          };
        }),
      );
    },
    [activeTabKey, setDashboardTabs],
  );

  useEffect(() => {
    if (dashboardItems) {
      setCurRowNum(() =>
        Math.max(
          DEFAULT_ROW_NUM,
          ...dashboardItems.map((item) => item.layout.y + item.layout.h),
        ),
      );
    }
  }, [dashboardItems]);

  useEffect(() => {
    projectQuery.isFetching ? setLoading(true) : setLoading(false);
  }, [projectQuery.isFetching, setLoading]);

  useEffect(() => {
    if (project?.webDashboard) {
      setDashboardTabs(project?.webDashboard);
      setActiveTabKey(project?.webDashboard?.[0]?.key);
    }
  }, [project?.webDashboard]);

  useEffect(() => {
    if (!project?.webDashboard || project?.webDashboard?.length === 0) {
      const newKey = uuid.v4();

      setDashboardTabs([
        {
          key: newKey,
          title: t('Dashboard'),
          content: [],
        },
      ]);
      setActiveTabKey(newKey);
    }
  }, [project?.webDashboard, project?.webDashboard?.length, t]);

  return (
    <>
      <Row gutter={token.size}>
        <Col span={4}>
          <ListWidgetLayout
            $token={token}
            direction="vertical"
            size="middle"
            css={css`
              overflow-y: auto;
            `}
          >
            <Space align="center" size="large">
              <BlockOutlined
                css={css`
                  font-size: ${token.fontSizeHeading5}px;
                `}
              />

              <Typography.Text
                css={css`
                  font-size: ${token.fontSizeHeading4}px;
                `}
              >
                {t('Widgets')}
              </Typography.Text>
            </Space>

            {Object.keys(FULL_ATTRIBUTES_WIDGETS).map((widgetType) => {
              const widget = FULL_ATTRIBUTES_WIDGETS[widgetType as TWidgetType];

              return (
                <BaseDashboardItem
                  css={css`
                    cursor: grab;
                    min-height: ${ITEM_UNIT_HEIGHT}px;
                  `}
                  $token={token}
                  className="droppable-element"
                  key={widgetType}
                  draggable
                  onDragStart={() => setDroppingItem(widget)}
                  onDragEnd={() => setDroppingItem(undefined)}
                >
                  <widget.Widget context="selector" />
                </BaseDashboardItem>
              );
            })}
          </ListWidgetLayout>
        </Col>

        <Col span={20}>
          <DragableTabs
            tabs={dashboardTabs}
            setTabs={setDashboardTabs}
            activeKey={activeTabKey}
            setActiveKey={setActiveTabKey}
          />

          <DashboardLayout
            $token={token}
            css={css`
              height: ${curRowNum * ITEM_UNIT_HEIGHT +
              MARGIN_DASHBOARD * (curRowNum + 1.5)}px;
            `}
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
              css={css`
                height: 100% !important;
              `}
              className="layout"
              compactType={null}
              cols={NUMBER_OF_COLUMNS}
              rowHeight={ITEM_UNIT_HEIGHT}
              isDroppable={true}
              droppingItem={droppingItem?.layoutSettings}
              margin={[MARGIN_DASHBOARD, MARGIN_DASHBOARD]}
              onLayoutChange={(layout) => {
                setDashboardItems(
                  dashboardItems.map((item) => {
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

                setDashboardItems([
                  {
                    type: droppingItem.type,
                    properties: {
                      title: `${droppingItem?.type}-${dashboardItems.length}`,
                    },
                    layout: {
                      ...item,
                      i: `${droppingItem?.type}-${dashboardItems.length}`,
                    },
                  },
                  ...dashboardItems,
                ]);
              }}
            >
              {dashboardItems?.map((item) => {
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
                      dashboardItems={dashboardItems}
                      dashboardItem={item}
                      devices={devices.map((x) => ({
                        ...x,
                        gateway: project?.gateways.find(
                          (g) => g.id === x.gatewayId,
                        ),
                      }))}
                      onSave={(items) => {
                        setDashboardItems(items);
                      }}
                    >
                      <widget.Widget
                        context="editor"
                        properties={item.properties}
                        defaultProperties={widget.defaultProperties}
                        device={devices.find(
                          (x) => x.id === item.properties.deviceId,
                        )}
                      />
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
              to: '/d/projects/$projectId/dashboard',
              params: { projectId },
            })
          }
        />

        <FloatButton
          icon={<SaveOutlined />}
          tooltip={t('Save')}
          type="primary"
          onClick={() => updateWebDashboard.mutate(dashboardTabs)}
        />
      </FloatButton.Group>
    </>
  );
}

const ListWidgetLayout = styled(
  Space,
  styledOmit$PropsOptions,
)<TAntdToken>(({ $token }) => ({
  padding: $token.paddingXS,
  borderRadius: $token.borderRadius,
  backgroundColor: $token.colorBgLayout,
  height: 'calc(100vh - 275px)',
  width: '100%',
}));

const DashboardLayout = styled.div<TAntdToken>`
  background-color: ${({ $token }) => $token.colorBgContainer};
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px dashed ${({ $token }) => $token.colorBorder};
  position: relative;
  /* overflow-y: hidden; */
  max-height: calc(100vh - 330px);
  overflow-y: auto;
  width: '100%';
`;

const DashboardBoxRow = styled.div<TAntdToken>`
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

const DashboardBoxCol = styled.div<TAntdToken>`
  border-radius: ${({ $token }) => $token.borderRadius}px;
  padding: ${({ $token }) => $token.sizeXXS};
  height: 96px;
`;

const DashboardBox = styled.div<TAntdToken>`
  background-color: ${({ $token }) => $token.colorBgLayout};
  height: 100%;
  width: 100%;
  border-radius: ${({ $token }) => $token.borderRadius}px;
`;
