export interface CurrentUser {
  email: string;
  tenant: string;
  roles: number[];
  access: number[];
  expireAt: Date;
}
