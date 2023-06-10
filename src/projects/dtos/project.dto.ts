export class ProjectDto {
  guid: string;
  name: string;
  templateId: string;
  audioFileName?: string;

  createdAt: Date;
  updatedAt: Date;
}
