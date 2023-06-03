import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProjectSettings } from '../project-settings.interface';
import { User } from '../../users/entities/user.entity';
import { ProjectDto } from '../dtos/project.dto';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  guid: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ type: 'jsonb', default: {} })
  settings: ProjectSettings;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  public toDto(): ProjectDto {
    return {
      guid: this.guid,
      name: this.name,
      templateId: this.templateId,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
