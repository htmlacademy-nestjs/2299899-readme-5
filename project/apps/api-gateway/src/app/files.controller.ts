import 'multer';

import { Express } from 'express';
import FormData from 'form-data';

import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, Param, UseFilters } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';

@Controller('files')
@UseFilters(AxiosExceptionFilter)
export class FilesController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @Get('/:id')
  public async getFile(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`http://localhost:${this.config.fileStoragePort}/api/files/${id}`)
    return data;
  }
}
