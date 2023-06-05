import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audios')
export class Audio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  guid: string;

  audioFileName: string;

  @Column({ type: 'bytea' })
  compressedRms: Buffer;


}
