import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public id: string;

  @Expose()
  public email: string;

  @Expose()
  public username: string;

  @Expose()
  public name: string;

  @Expose()
  public avatar: string;

  @Expose()
  public birthDate: string;

  @Expose()
  public role: string;

  @Expose()
  public registerDate: string;
}
