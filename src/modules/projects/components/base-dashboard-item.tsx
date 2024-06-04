import styled from '@emotion/styled';

import { TAntdToken } from '@/shared/types/tst.type';

const BaseDashboardItem = styled.div<
  TAntdToken & { $editing?: boolean; $minHeight?: number }
>`
  position: relative;
  cursor: ${({ $editing }) => ($editing ? 'move' : 'default')};
  min-height: ${({ $minHeight }) => $minHeight}px;
  border-radius: ${({ $token }) => $token.borderRadius}px;
  background-color: ${({ $token }) => $token.colorBgElevated};
  box-shadow: ${({ $token }) => $token.boxShadowSecondary};
  padding: ${({ $token, $editing }) => ($editing ? 0 : $token.paddingXS)}px;
`;

export default BaseDashboardItem;
