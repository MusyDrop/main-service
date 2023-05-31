import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUniqueId } from '../utils/unique-id-generator';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>
  ) {}

  async onModuleInit(): Promise<void> {
    const user = await this.usersRepository.save({
      email: `${generateUniqueId()}-mail@example.com`,
      password: generateUniqueId()
    });
    const profile = await this.profilesRepository.save({ user: { id: user.id } });


  }
}
