import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('audios')
export class Audio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  guid: string;

  @Column({ name: 'audio_file_name', unique: true })
  audioFileName: string;

  @Column({ name: 'duration_secs', type: 'real' })
  durationSecs: number;

  @Column({ name: 'bits_per_sample' })
  bitsPerSample: number;

  @Column({ name: 'number_of_channels' })
  numberOfChannels: number;

  @Column()
  bitrate: number;

  @Column()
  lossless: boolean;

  @Column({ name: 'number_of_samples' })
  numberOfSamples: number;

  @Column()
  codec: string;

  @Column()
  container: string;

  @Column('int', { array: true, name: 'compressed_rms' })
  compressedRms: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
