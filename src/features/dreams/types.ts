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
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  authorUsername?: string;
  analysisStatus: string;
  emotion?: string;
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
