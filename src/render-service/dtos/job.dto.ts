import { AnyObject } from '../../utils/utility-types';
import { JobStatus } from './job-status.enum';

export class JobDto {
  guid: string;
  status: JobStatus;
  templateGuid: string;
  audioFileName: string;
  settings: AnyObject;
  userGuid: string;
  createdAt: Date;
}
