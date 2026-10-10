export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  imagePath: string;
}
