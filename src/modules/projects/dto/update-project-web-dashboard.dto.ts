import { TWebDashboardTab } from '../project.model';

export type TUpdateDashboardDto = {
  webDashboard?: TWebDashboardTab[];
  mobileDashboard?: TWebDashboardTab[];
};
