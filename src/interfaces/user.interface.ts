import { Gender } from "src/enums/gender.enum";

export interface IUser {
  id: string;
  name: string;
  gender: Gender;
  email: string;
  avatar?: string;
  username: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  level: number;
  xp: number;
  ownedCoinsCount: number; // Number of owned coins
  caughtCoinsCount: number; // Number of caught coins
}