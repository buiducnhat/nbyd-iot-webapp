import { BlockOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Col, Row, Space, Typography } from 'antd';
import { useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import {
  BaseDashboardItem,
  EditableDashboardItem,
} from '@/modules/projects/components/dashboard-item';
import {
  TDashboardItem,
  TWidgetCommon,
  listWidgetCommon,
} from '@/modules/projects/components/widgets';
import { TST } from '@/shared/types/tst.type';

export const Route = createFileRoute('/_app/projects/_$projectId/dashboard')({
  component: ProjectIdDashboard,
});

const GridLayout = WidthProvider(RGL);

function ProjectIdDashboard() {
  const { t, token } = useApp();

  const [items, setItems] = useState<TDashboardItem[]>([]);
  const [droppingItem, setDroppingItem] = useState<TWidgetCommon>();

  return (
    <Row gutter={token.size}>
      <Col span={4}>
        <ListWidgetLayout token={token} direction="vertical" size="middle">
          <Space align="center" size="large">
            <BlockOutlined style={{ fontSize: token.fontSizeHeading5 }} />
            <Typography.Text style={{ fontSize: token.fontSizeHeading4 }}>
              {'Widgets'}
            </Typography.Text>
          </Space>

          {listWidgetCommon.map((widget) => {
            return (
              <BaseDashboardItem
                token={token}
                className="droppable-element"
                key={widget.type}
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
        <DashboardLayout token={token}>
          <DashboardBoxRow token={token}>
            {new Array(24 * 10).fill(0).map((_, index) => {
              return (
                <DashboardBoxCol key={index} token={token}>
                  <DashboardBox token={token}></DashboardBox>
                </DashboardBoxCol>
              );
            })}
          </DashboardBoxRow>

          <GridLayout
            className="layout"
            style={{ height: '100%' }}
            compactType={null}
            cols={24}
            rowHeight={96}
            isDroppable={true}
            droppingItem={droppingItem?.layout}
            margin={[8, 8]}
            onDrop={(_layout, item) => {
              if (!droppingItem) return;

              setItems((prev) => [
                {
                  type: droppingItem.type,
                  layout: {
                    ...item,
                    i: `${droppingItem?.type}-${prev.length}`,
                  },
                  title: `${droppingItem?.type}-${prev.length}`,
                },
                ...prev,
              ]);
            }}
          >
            {items.map((item) => {
              const widgetCommon = listWidgetCommon.find(
                (x) => x.type === item.type,
              );

              if (!widgetCommon) return null;

              return (
                <BaseDashboardItem
                  key={item.layout.i}
                  token={token}
                  className="droppable-element"
                  data-grid={{
                    x: item.layout.x,
                    y: item.layout.y,
                    w: item.layout.w,
                    h: item.layout.h,
                    minW: widgetCommon.layout.minW,
                    maxW: widgetCommon.layout.maxW,
                    minH: widgetCommon.layout.minH,
                    maxH: widgetCommon.layout.maxH,
                  }}
                >
                  <EditableDashboardItem>
                    <widgetCommon.Widget title={item.title} />
                  </EditableDashboardItem>
                </BaseDashboardItem>
              );
            })}
          </GridLayout>
        </DashboardLayout>
      </Col>
    </Row>
  );
}

const ListWidgetLayout = styled(Space)<TST>`
  padding: ${({ token }) => token.paddingXS}px;
  border-radius: ${({ token }) => token.borderRadius}px;
  background-color: ${({ token }) => token.colorBgLayout};
  height: 100%;
  width: 100%;
`;

const DashboardLayout = styled.div<TST>`
  background-color: ${({ token }) => token.colorBgContainer};
  border-radius: ${({ token }) => token.borderRadius}px;
  border: 1px dashed ${({ token }) => token.colorBorder};
  position: relative;
  overflow: hidden;
  height: 528px;
  width: '100%';
`;

const DashboardBoxRow = styled.div<TST>`
  padding: ${({ token }) => token.paddingXS}px;
  margin: 0 !important;
  border-radius: ${({ token }) => token.borderRadius}px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 8px;
`;

const DashboardBoxCol = styled.div<TST>`
  border-radius: ${({ token }) => token.borderRadius}px;
  padding: ${({ token }) => token.sizeXXS};
  height: 96px;
`;

const DashboardBox = styled.div<TST>`
  background-color: ${({ token }) => token.colorBgLayout};
  height: 100%;
  width: 100%;
  border-radius: ${({ token }) => token.borderRadius}px;
`;
