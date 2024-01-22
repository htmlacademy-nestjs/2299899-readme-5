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
  Min = 3,
  Max = 12,
}
