export interface File {
  id?: string;
  originalName: string;
  subDirectory: string;
  size: number;
  mimeType;
  hashName: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}
