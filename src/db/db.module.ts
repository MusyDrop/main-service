import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ExtendedConfigService } from '../config/extended-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ExtendedConfigService],
      useFactory: (config: ExtendedConfigService) => ({
        type: 'postgres',
        host: config.get('postgres.host'),
        port: config.get('postgres.port'),
        username: config.get('postgres.username'),
        password: config.get('postgres.password'),
        database: config.get('postgres.database'),
        synchronize: true, // remove after db scaffolding,
        // logging: true,
        autoLoadEntities: true
      })
    })
  ],
  controllers: [DbController],
  providers: [DbService],
  exports: [TypeOrmModule]
})
export class DbModule {}
