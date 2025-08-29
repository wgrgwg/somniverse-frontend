export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  totalChildrenCount?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
