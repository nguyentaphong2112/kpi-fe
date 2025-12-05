export interface IHbtOption<T = number> {
  value: T;
  label: string;
  color?: string;
  backgroud?: string;
  disabled?: boolean;
  data?: any;
}

export const statusOptions = (): IHbtOption[] => [
  { value: 1, label: 'Sử dụng', color: '#06A561', backgroud: '#DAF9EC' },
  { value: 0, label: 'Không sử dụng', color: '#FA0B0B', backgroud: '#FDE7EA' },
];
