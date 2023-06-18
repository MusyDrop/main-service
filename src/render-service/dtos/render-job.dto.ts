import { AnyObject } from '../../utils/utility-types';

export class RenderJobDto {
  templateGuid: string;
  projectGuid: string;
  audioFileName: string;
  settings: AnyObject;
  compressedRms: number[];
  audioDurationSecs: number;
}
