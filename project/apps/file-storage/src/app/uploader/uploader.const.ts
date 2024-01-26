export const SERVE_ROOT = '/static';

export enum UploadTarget {
  Avatar = 'Avatar',
  Photo = 'Photo',
}

export const ALLOWED_EXTENSIONS = {
  Avatar: ['jpeg', 'png'],
  Photo: ['jpg', 'png'],
};

export enum AllowedSize {
  Avatar = 500000,
  Photo = 1000000,
}

export enum UploaderApiMessage {
  FileUloaded = 'File successfully uploaded',
  FileDataRead = 'File meta data read',
  FileValidationError = 'File validation error',
  FileNotFound = 'File not found',
}

export const FILE_PARAMETER = {
  name: 'file',
  type: 'file',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    },
  },
  description: 'Picture file',
};

export const API_AUTH_HEADER = {
  name: 'Authorization',
  description: 'Authorization JWT token',
  required: true,
}
