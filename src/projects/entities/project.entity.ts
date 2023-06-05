import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProjectSettings } from '../interfaces/project-settings.interface';
import { User } from '../../users/entities/user.entity';
import { ProjectDto } from '../dtos/project.dto';
import { Audio } from './audio.entity';

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

  @OneToOne(() => Audio, { nullable: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'audio_id' })
  audio?: Audio;

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

  public static toDto(project?: Project): ProjectDto | null {
    if (!project) return null;
    return {
      guid: project.guid,
      name: project.name,
      templateId: project.templateId,

      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };
  }
}
