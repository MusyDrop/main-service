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
import { User } from '../../users/entities/user.entity';
import { addSeconds } from 'date-fns';

@Entity({ name: 'email_verifications' })
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  guid: string;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  verified: boolean;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  public setExpiredAt(expiresInSec: number): void {
    this.expiresAt = addSeconds(new Date(), expiresInSec);
  }
}
