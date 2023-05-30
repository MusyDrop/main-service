import { Controller, Get, Query } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { GetAudioMetadataQueryDto } from './dtos/get-audio-metadata-query.dto';

@Controller('analyzer')
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Get('/metadata')
  public async getMetadata(
    @Query() body: GetAudioMetadataQueryDto
  ): Promise<any> {
    return await this.analyzerService.getAudioMetadata(body.audioFileName);
  }
}
