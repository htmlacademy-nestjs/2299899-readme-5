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
