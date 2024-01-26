import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpStatus, Inject, Param, UseFilters } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { AppPath, FilesMessage, ROOT_PATH } from './app.const';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';

@ApiTags('files')
@Controller('files')
@UseFilters(AxiosExceptionFilter)
export class FilesController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, description: FilesMessage.FileRead })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: FilesMessage.FileNotFound })
  @Get('/:id')
  public async getFile(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(`${ROOT_PATH}:${this.config.fileStoragePort}${AppPath.Files}/${id}`);
    return data;
  }
}
