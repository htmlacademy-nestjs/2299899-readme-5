export const ENV_USERS_FILE_PATH = 'apps/users/.users.env';

export enum DefaultPort {
  App = 3004,
  Rabbit = 5672,
}

export enum MongoPort {
  MIN = 0,
  MAX = 65535,
  DEFAULT = 27017,
}

export enum EnvMongoValidationMessage {
  DBHostRequired = 'MongoDB host is required',
  DBNameRequired = 'Database name is required',
  DBPortRequired = 'MongoDB port is required',
  DBUserRequired = 'MongoDB user is required',
  DBPasswordRequired = 'MongoDB password is required',
  DBBaseAuthRequired = 'MongoDB authentication base is required',
}
