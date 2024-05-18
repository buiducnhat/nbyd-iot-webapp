import { EGatewayConnection, EGatewayHardware } from '../gateway.model';

export type TCreateGatewayDto = {
  name: string;
  description?: string;
  hardware: EGatewayHardware;
  connection: EGatewayConnection;
};

export type TUpdateGatewayDto = {
  name?: string;
  description?: string;
};
