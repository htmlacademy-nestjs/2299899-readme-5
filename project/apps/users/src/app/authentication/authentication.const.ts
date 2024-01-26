export enum AuthUserErrorMessage {
  EmailRequired = 'Email is required',
  EmailNotValid = 'Email not valid',
  UsernameRequired = 'User\'s lastname and fisrtname are required',
  UsernameMinLength = 'Length of field user\'s lastname and fisrtname must be at least 3 symbols',
  UsernameMaxLength = 'Length of field user\'s lastname and fisrtname must be no more than 50 symbols',
  PasswordRequired = 'Password is required',
  PasswordMinLength = 'Password length must be at least 3 symbols',
  PasswordMaxLength = 'Password length must be no more than 12 symbols',
  UserExists = 'User with this email already exists',
  UserNotFound = 'User not found',
  WrongPassword = 'Wrong user password',
}

export enum UsernameLength {
  Min = 3,
  Max = 50,
}

export enum PasswordLength {
  Min = 6,
  Max = 12,
}

export enum UsersApiMessage {
  UserCreated = 'New user has been successfully created',
  UserCreateForbidden = 'Allowed only for not authorized users',
  LoginSuccess = 'User has been successfully logged',
  LoginError = 'Wrong password or login',
  RefreshOk = 'Get a new access/refresh tokens',
  ChangePasswordSuccess = 'Successfully changed user\'s password',
  ChangePasswordValidationError = 'Password validation error',
  ChangePasswordUnauthorized = 'Unauthorized',
  UserRead = 'User read success',
  UserNotFound = 'User not found',
}

export const API_AUTH_HEADER = {
  name: 'Authorization',
  description: 'Authorization JWT token',
  required: true,
}
