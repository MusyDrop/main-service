export class ProjectDto {
  guid: string;
  name: string;
  templateGuid: string;
  audioFileName?: string;

  createdAt: Date;
  updatedAt: Date;
}
