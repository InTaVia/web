export interface Bin<T = number> {
  label: string;
  count: number;
  values: [T, T];
  order?: number;
}

export interface Node<T extends { id: string }> {
  id: T['id'];
  count: number;
  label: string;
  children: Array<Node<T>>;
}

export interface RootNode<T extends { id: string }> extends Node<T> {
  id: 'root';
}

export interface InternationalizedLabel {
  default: string;
  de?: string;
  du?: string;
  en?: string;
  fi?: string;
  si?: string;
}

export type PaginatedRequest<T> = T & {
  /** @default 1 */
  page?: number;
  /** @default 50 */
  limit?: number;
};

export interface PaginatedResponse<T> {
  count: number;
  page: number;
  pages: number;
  results: Array<T>;
}
