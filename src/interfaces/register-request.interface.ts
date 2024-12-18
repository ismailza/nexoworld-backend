import { Gender } from "src/enums/gender.enum";

export interface RegisterRequest {
  name: string;
  gender: Gender;
  email: string;
  username: string;
  password: string;
}