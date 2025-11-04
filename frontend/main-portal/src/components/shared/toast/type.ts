export type TToastType = 'success' | 'error' | 'info';

export interface IToastProps {
  title?: string;
  type?: TToastType;
}
