import { EditTwoTone } from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/react';
import { Dropdown, Input, Modal, Tabs } from 'antd';
import React, { useCallback, useMemo } from 'react';
import * as uuid from 'uuid';

import useApp from '@/hooks/use-app';

import { TWebDashboardTab } from '../project.model';

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
}

const DraggableTabNode = ({
  onContextMenu,
  ...props
}: DraggableTabPaneProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props['data-node-key'],
    });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
    transition,
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    onContextMenu,
    style,
    ...attributes,
    ...listeners,
  });
};

type TTabItem = {
  key: string;
  label: string;
  children: React.ReactNode;
  closable?: boolean;
};

type TDragableTagsProps = {
  viewMode?: boolean;
  tabs: TWebDashboardTab[];
  setTabs: React.Dispatch<React.SetStateAction<TWebDashboardTab[]>>;
  activeKey?: string;
  setActiveKey?: React.Dispatch<React.SetStateAction<string>>;
};

const DragableTabs = ({
  viewMode,
  tabs,
  setTabs,
  activeKey,
  setActiveKey,
}: TDragableTagsProps) => {
  const { t } = useApp();

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const [openRenameModal, setOpenRenameModal] = React.useState(false);
  const [renamingTab, setRenamingTab] = React.useState<TTabItem>();

  const items = useMemo(
    () =>
      tabs.map((tab) => ({
        key: tab.key,
        label: tab.title,
        children: null,
        closable: tabs.length > 1 && !viewMode,
      })),
    [tabs, viewMode],
  );

  const setItems = useCallback(
    (newItems: TTabItem[]) => {
      setTabs((prev) =>
        newItems.map((item) => {
          const tab = prev.find((p) => p.title === item.label);
          return {
            key: item.key,
            title: item.label,
            content: tab?.content ?? [],
          };
        }),
      );
    },
    [setTabs],
  );

  return (
    <>
      <Modal
        title={t('Rename Tab')}
        open={openRenameModal}
        onCancel={() => {
          setOpenRenameModal(false);
        }}
        onOk={() => {
          setItems(
            items.map((item) =>
              item.key === renamingTab?.key
                ? { ...item, label: renamingTab.label }
                : item,
            ),
          );
          setOpenRenameModal(false);
        }}
      >
        <Input
          value={renamingTab?.label}
          onChange={(e) => {
            setRenamingTab((prev) =>
              prev ? { ...prev, label: e.target.value } : undefined,
            );
          }}
        />
      </Modal>

      <Tabs
        css={css`
          &.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
            transition: none;
          }
        `}
        type="editable-card"
        activeKey={activeKey}
        hideAdd={viewMode}
        onChange={(key) => setActiveKey?.(key)}
        onEdit={(key, action) => {
          if (action === 'add') {
            const newKey = uuid.v4();
            setItems([
              ...items,
              {
                key: newKey,
                label: t('New Dashboard'),
                children: null,
                closable: true,
              },
            ]);
            setActiveKey?.(newKey);
          } else if (action === 'remove') {
            const index = items.findIndex((i) => i.key === key);
            if (index === -1) {
              return;
            } else if (items.length === 1) {
              return;
            } else if (activeKey === key) {
              setActiveKey?.(items[index + 1]?.key ?? items[index - 1]?.key);
            }
            setItems(items.filter((i) => i.key !== key));
          }
        }}
        items={items}
        renderTabBar={
          viewMode
            ? undefined
            : (tabBarProps, DefaultTabBar) => {
                return (
                  <DndContext
                    sensors={[sensor]}
                    onDragEnd={({ active, over }) => {
                      const activeIndex = items.findIndex(
                        (i) => i.key === active.id,
                      );
                      const overIndex = items.findIndex(
                        (i) => i.key === over?.id,
                      );
                      setItems(arrayMove(items, activeIndex, overIndex));
                    }}
                  >
                    <SortableContext
                      items={items.map((item) => item.key)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <DefaultTabBar {...tabBarProps}>
                        {(node) => (
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  label: t('Rename'),
                                  icon: <EditTwoTone />,
                                  key: 'rename',
                                  onClick: () => {
                                    setRenamingTab(
                                      items.find((i) => i.key === node.key),
                                    );
                                    setOpenRenameModal(true);
                                  },
                                },
                              ],
                            }}
                            trigger={['contextMenu']}
                          >
                            <DraggableTabNode
                              {...node.props}
                              key={node.key}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              {node}
                            </DraggableTabNode>
                          </Dropdown>
                        )}
                      </DefaultTabBar>
                    </SortableContext>
                  </DndContext>
                );
              }
        }
      />
    </>
  );
};

export default DragableTabs;
