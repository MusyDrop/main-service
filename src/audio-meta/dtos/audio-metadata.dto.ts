export class AudioMetadataDto {
  durationSecs: number;
  bitsPerSample: number;
  sampleRate: number;
  numberOfChannels: number;
  bitrate: number;
  lossless: boolean;
  numberOfSamples: number;
  codec: string;
  container: string;
}
