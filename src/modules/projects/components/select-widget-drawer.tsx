import { BlockOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Drawer, Flex, Space, Typography } from 'antd';

import useApp from '@/hooks/use-app';

import BaseDashboardItem from './base-dashboard-item';
import { FULL_ATTRIBUTES_WIDGETS, TWidgetType } from './widgets';

type TSelectWidgetDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelected: (widgetType: TWidgetType) => void;
};

const SelectWidgetDrawer = ({
  open,
  setOpen,
  onSelected,
}: TSelectWidgetDrawerProps) => {
  const { token, t } = useApp();

  return (
    <Drawer
      title={t('Select widget')}
      placement="bottom"
      closable
      open={open}
      onClose={() => setOpen(false)}
      height="80%"
    >
      <Flex vertical gap={token.size}>
        <Space align="center">
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
              $token={token}
              key={widgetType}
              onClick={() => onSelected(widgetType as TWidgetType)}
            >
              <widget.Widget context="selector" />
            </BaseDashboardItem>
          );
        })}
      </Flex>
    </Drawer>
  );
};

export default SelectWidgetDrawer;
