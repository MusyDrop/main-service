import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUniqueId } from '../utils/unique-id-generator';
import { ProfilesService } from './profiles.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly profilesService: ProfilesService
  ) {}

  public async findByIdNullable(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  public async findById(id: number): Promise<User> {
    const user = await this.findByIdNullable(id);

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  /**
   * Creates user and its account
   * @param userProps
   */
  public async create(userProps: DeepPartial<User>): Promise<User> {
    return await this.usersRepository.save({
      email: userProps.email,
      password: userProps.password
    });
  }

  public async onModuleInit(): Promise<void> {
    const user = await this.usersRepository.save({
      email: `${generateUniqueId()}-mail@example.com`,
      password: generateUniqueId()
    });
    const profile = await this.profilesService.create({
      user: { id: user.id }
    });
  }
}
