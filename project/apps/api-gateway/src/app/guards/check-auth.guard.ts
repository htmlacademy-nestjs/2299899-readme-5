import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { apiGatewayConfig } from '@project/shared-libs/config/api-gateway';

import { AppPath, ROOT_PATH } from '../app.const';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiGatewayConfig.KEY) private readonly config: ConfigType<typeof apiGatewayConfig>,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { data } = await this.httpService.axiosRef.post(`${ROOT_PATH}:${this.config.usersPort}${AppPath.Users}/check`, {}, {
      headers: { 'Authorization': request.headers['authorization'] },
    });

    request['user'] = data;

    return true;
  }
}
