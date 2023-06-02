import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  guid: string;

  @Column({ unique: true })
  email: string;

  /**
   * Nullable when authenticated via OAUTH
   */
  @Column({ nullable: true })
  password?: string;

  /**
   * Is authenticated by using google oauth identity provider
   */
  @Column({ default: false })
  isOAuthEnabled: boolean;

  /**
   * Used for 2FA
   */
  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: false })
  profile: Profile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
