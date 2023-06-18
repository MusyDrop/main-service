import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HttpService } from '@nestjs/axios';
import { GetOneTemplateResponseDto } from './dtos/response/get-one-template-response.dto';
import { RenderJobDto } from './dtos/render-job.dto';
import { RenderJobResponseDto } from './dtos/response/render-job-response.dto';

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

  public async render(
    dto: RenderJobDto,
    accessToken: string
  ): Promise<RenderJobResponseDto> {
    const res = await this.axios.get(`/jobs/render`, {
      headers: {
        Cookie: `Auth=${accessToken}`
      }
    });

    return res.data;
  }
}
