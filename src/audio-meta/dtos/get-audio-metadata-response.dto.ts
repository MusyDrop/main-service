import { AudioMetadataDto } from './audio-metadata.dto';

export class GetAudioMetadataResponseDto extends AudioMetadataDto {
  // compressed RMS values to minimise network overload
  compressedRms: number[];
}
