import { CloseOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Flex, FloatButton } from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import * as uuid from 'uuid';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import useGetListDevice from '@/modules/devices/hooks/use-get-list-device';
import BaseDashboardItem from '@/modules/projects/components/base-dashboard-item';
import { MTopLayerEdit } from '@/modules/projects/components/dashboard-item-top-layer';
import DragableTabs from '@/modules/projects/components/dragable-tabs';
import SelectWidgetDrawer from '@/modules/projects/components/select-widget-drawer';
import {
  FULL_ATTRIBUTES_WIDGETS,
  TDashboardItem,
} from '@/modules/projects/components/widgets';
import useGetProjectDetail from '@/modules/projects/hooks/use-get-project-detail';
import { TWebDashboardTab } from '@/modules/projects/project.model';
import projectService from '@/modules/projects/project.service';
import { THttpResponse } from '@/shared/http-service';
import { TAntdToken } from '@/shared/types/tst.type';
import { transApiResDataCode } from '@/shared/utils';

const GridLayout = WidthProvider(RGL);

export const Route = createFileRoute(
  '/_app/m/projects/$projectId/_layout/dashboard/edit',
)({
  component: MProjectIdEditDashboard,
});

const DEFAULT_ROW_NUM = 7;
const NUMBER_OF_COLUMNS = 8;
const ITEM_UNIT_HEIGHT = 80;
const MARGIN_DASHBOARD = 8;

function MProjectIdEditDashboard() {
  const { projectId } = Route.useParams();

  const navigate = useNavigate();

  const { t, token, antdApp } = useApp();

  const setLoading = useAppStore((state) => state.setLoading);

  const { project, projectQuery } = useGetProjectDetail(projectId);
  const { devices } = useGetListDevice(projectId);

  const [dashboardTabs, setDashboardTabs] = useState<TWebDashboardTab[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>('');
  const [curRowNum, setCurRowNum] = useState<number>(DEFAULT_ROW_NUM);
  const [openSelectWidgetDrawer, setOpenSelectWidgetDrawer] = useState(false);

  const updatemobileDashboard = useMutation({
    mutationFn: (mobileDashboard: TWebDashboardTab[]) =>
      projectService.updateDashboard(projectId, {
        mobileDashboard: mobileDashboard,
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
    if (project?.mobileDashboard) {
      setDashboardTabs(project?.mobileDashboard);
      setActiveTabKey(project?.mobileDashboard?.[0]?.key);
    }
  }, [project?.mobileDashboard]);

  useEffect(() => {
    if (!project?.mobileDashboard || project?.mobileDashboard?.length === 0) {
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
  }, [project?.mobileDashboard, project?.mobileDashboard?.length, t]);

  return (
    <>
      <SelectWidgetDrawer
        open={openSelectWidgetDrawer}
        setOpen={setOpenSelectWidgetDrawer}
        onSelected={(widgetType) => {
          setOpenSelectWidgetDrawer(false);
          const newWidget = FULL_ATTRIBUTES_WIDGETS[widgetType];
          if (!newWidget) return;

          setDashboardItems([
            ...dashboardItems,
            {
              type: widgetType,
              properties: {
                title: `${widgetType}-${dashboardItems.length}`,
              },
              layout: {
                ...newWidget.layoutSettings,
                i: `${widgetType}-${dashboardItems.length}`,
                x: 0,
                y: 0,
              },
            },
          ]);
        }}
      />

      <Flex vertical>
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
            {new Array(NUMBER_OF_COLUMNS * curRowNum)
              .fill(0)
              .map((_, index) => {
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
          >
            {dashboardItems?.map((item) => {
              const widget = FULL_ATTRIBUTES_WIDGETS[item.type];

              if (!widget) return null;

              return (
                <BaseDashboardItem
                  key={item.layout.i}
                  $editing
                  $token={token}
                  $minHeight={ITEM_UNIT_HEIGHT}
                  className="droppable-element"
                  data-grid={{
                    ...item.layout,
                    minW: widget.layoutSettings.minW,
                    maxW: widget.layoutSettings.maxW,
                    minH: widget.layoutSettings.minH,
                    maxH: widget.layoutSettings.maxH,
                  }}
                >
                  <MTopLayerEdit
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
                  </MTopLayerEdit>
                </BaseDashboardItem>
              );
            })}
          </GridLayout>
        </DashboardLayout>
      </Flex>

      <FloatButton.Group>
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => setOpenSelectWidgetDrawer(true)}
        />

        <FloatButton
          icon={<CloseOutlined />}
          tooltip={t('Cancel')}
          onClick={() =>
            navigate({
              to: '/m/projects/$projectId/dashboard',
              params: { projectId },
            })
          }
        />

        <FloatButton
          icon={<SaveOutlined />}
          tooltip={t('Save')}
          type="primary"
          onClick={() => updatemobileDashboard.mutate(dashboardTabs)}
        />
      </FloatButton.Group>
    </>
  );
}

const DashboardLayout = styled.div<TAntdToken>`
  background-color: ${({ $token }) => $token.colorBgContainer};
  border-radius: ${({ $token }) => $token.borderRadius}px;
  border: 1px dashed ${({ $token }) => $token.colorBorder};
  position: relative;
  max-height: calc(100dvh - 300px);
  overflow-y: auto;
  width: 100%;
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
  grid-template-columns: repeat(${NUMBER_OF_COLUMNS}, 1fr);
  gap: ${({ $token }) => $token.paddingXS}px;
`;

const DashboardBoxCol = styled.div<TAntdToken>`
  border-radius: ${({ $token }) => $token.borderRadius}px;
  /* padding: ${({ $token }) => $token.paddingXXS}px; */
  height: ${ITEM_UNIT_HEIGHT}px;
`;

const DashboardBox = styled.div<TAntdToken>`
  background-color: ${({ $token }) => $token.colorBgLayout};
  height: 100%;
  width: 100%;
  border-radius: ${({ $token }) => $token.borderRadius}px;
`;
