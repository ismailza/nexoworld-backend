export interface AppResponse<T = any> {
  success: boolean;
  result?: T;
  message?: string;
}
