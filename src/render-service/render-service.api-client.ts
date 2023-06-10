import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { GetOneTemplateResponseDto } from './dtos/response/GetOneTemplateResponseDto';

@Injectable()
export class RenderServiceApiClient {
  private readonly axios: AxiosInstance;

  constructor(private readonly httpService: HttpService) {
    this.axios = httpService.axiosRef;
  }

  public async findTemplateByGuid(
    guid: string,
    accessToken: string
  ): Promise<GetOneTemplateResponseDto> {
    const res = await this.axios.get(`/templates/${guid}`, {
      headers: {
        Cookie: `Auth=${accessToken}`
      }
    });
    return res.data;
  }
}
