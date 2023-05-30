import { IsNotEmpty, IsString } from 'class-validator';

export class GetAudioMetadataQueryDto {
  /**
   * Audio file name in the S3 storage
   */
  @IsString()
  @IsNotEmpty()
  audioFileName: string;
}
