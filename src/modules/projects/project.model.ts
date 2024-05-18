import { TGateway } from '../gateways/gateway.model';
import { TDashboardItem } from './components/widgets';

export enum EProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type TProjectBasic = {
  id: string;
  name: string;
  description?: string;
  status: EProjectStatus;
  imageFileId?: string;
  imageFileUrl?: string;
  _count: {
    gateways: number;
  };
  createdAt: string;
};

export type TWebDashboardTab = {
  key: string;
  title: string;
  content: TDashboardItem[];
};

export type TProjectDetail = TProjectBasic & {
  gateways: TGateway[];
  metaData?: any;
  webDashboard?: TWebDashboardTab[];
  mobileDashboard?: any;
  updatedAt: string;
};
