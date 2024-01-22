export const ENV_FILE_PATH = 'apps/api-gateway/.api-gateway.env';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Stage = 'stage',
};

export enum DefaultPorts {
  App = 3000,
  Blog = 3001,
  FileStorage = 3002,
  Notifications = 3003,
  Users = 3004,
}

export enum HttpClientDefaults {
  MaxRedirects = 5,
  Timeout = 5000,
}
