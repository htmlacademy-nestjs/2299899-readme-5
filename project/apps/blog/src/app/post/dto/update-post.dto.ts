import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  public type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public photo?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public anons?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public content?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  public tags?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public userId?: string;

  @IsUUID('all', { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  public comments: string[];
}
