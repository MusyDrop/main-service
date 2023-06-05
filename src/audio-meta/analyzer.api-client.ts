import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetAudioMetadataResponseDto } from './dtos/get-audio-metadata-response.dto';
import { AxiosInstance } from 'axios';

@Injectable()
export class AnalyzerApiClient {
  private readonly axios: AxiosInstance;

  constructor(private readonly httpService: HttpService) {
    this.axios = httpService.axiosRef;
  }

  /**
   * Analyses an audioFile uploaded to S3
   * @param audioFileName
   * @param aggregationRate
   */
  public async getAudioMetadata(
    audioFileName: string,
    aggregationRate = 30
  ): Promise<GetAudioMetadataResponseDto> {
    const res = await this.axios.get<GetAudioMetadataResponseDto>(
      '/analyzer/metadata',
      {
        params: {
          audioFileName,
          aggregationRate
        }
      }
    );

    return res.data;
  }
}
