export enum EUserGender {
  MALE,
  FEMALE,
  OTHER,
}

export enum EUserRole {
  ADMIN,
  USER,
}

export type TUser = {
  id: number;
  firstName: string;
  lastName?: string;
  dateOfBirth: Date | string;
  phoneNumber?: string;
  roles: EUserRole[];
  gender?: EUserGender;
  avatarImageFileId?: string;
  avatarImageFileUrl?: string;
  userLogin: {
    username: string;
    email: string;
    isEmailVerified: boolean;
  };
  externals: any;
  sessions: any;
  createdAt: Date | string;
};
