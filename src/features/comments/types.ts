export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
