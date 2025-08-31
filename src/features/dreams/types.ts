export interface Dream {
  id: number;
  title: string;
  content: string;
  dreamDate: string;
  isPublic: boolean;
  author: {
    id: number;
    username: string;
    email: string;
  };
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DreamPayload {
  title: string;
  content: string;
  dreamDate: string;
  isPublic: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
