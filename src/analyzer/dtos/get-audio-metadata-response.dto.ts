import { AudioMetadataDto } from './audio-metadata.dto';

export class GetAudioMetadataResponseDto extends AudioMetadataDto {
  rms: number[];
  // timestamps relative to each rms value
  timestamps: number[];
}
