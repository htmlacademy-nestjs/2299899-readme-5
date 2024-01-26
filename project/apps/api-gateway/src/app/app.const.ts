export const ROOT_PATH = 'http://localhost';

export enum AppPath {
  Register = '/api/auth/register',
  Login = '/api/auth/login',
  Refresh = '/api/auth/refresh',
  ChangePassword = '/api/auth/change_password',
  Users = '/api/auth',
  Posts = '/api/posts',
  Upload = '/api/files/upload',
  Files = '/api/files',
}

export enum BlogMessage {
  PostsReadAll = 'List of posts',
  PostsNotFound = 'There are no posts for provided filter',
  NewsletterSent = 'Newsletter with new posts sent',
  Unauthorized = 'Required jwt token authorization',
  PostCreated = 'New post created',
  PostRead = 'Single post',
  PostNotFound = 'Post with provided id not found',
  PostUpdate = 'Post updated successfully',
  PostDelete = 'Post deleted',
  ValidationFailed = 'Bad request, failed request validation',
  LikeToggled = 'Post like toggled',
  CommentCreate = 'Comment created',
}

export enum UsersMessage {
  UserCreated = 'New user created',
  UserAlreadyExists = 'User already exists conflict',
  LoginSuccess = 'Login successfully',
  LoginNotFound = 'Email not found',
  LoginWrongPassword = 'Wrong password',
  RefreshTokenSuccess = 'Refresh token success',
  RefreshTokenError = 'Refresh token error, unauthorized',
  ChangePasswordSuccess = 'Change password success',
  ChangePasswordError = 'Change password error, unathorized',
  ChangePasswordValidationError = 'Change password validation error',
  UserRead = 'Users read',
  UserNotFound = 'User not found',
}

export enum FilesMessage {
  FileRead = 'File read successfully',
  FileNotFound = 'File not found',
}

export const API_AUTH_HEADER = {
  name: 'Authorization',
  description: 'Authorization JWT token',
  required: true,
}

export const API_REFRESH_HEADER = {
  name: 'Authorization',
  description: 'Refresh JWT token',
  required: true,
}

export const QueryParams = {
  Title: { name: 'title', description: 'Query parameter' },
  Limit: { name: 'limit', description: 'Query parameter' },
  Type: { name: 'type', description: 'Query parameter' },
  Status: { name: 'status', description: 'Query parameter' },
  UserId: { name: 'userId', description: 'Query parameter' },
  Tag: { name: 'tag', description: 'Query parameter' },
  IsRepost: { name: 'isRepost', description: 'Query parameter' },
  SortOption: { name: 'sortOption', description: 'Query parameter' },
  SortDirection: { name: 'sortDirection', description: 'Query parameter' },
  Page: { name: 'page', description: 'Query parameter' },
} as const;
