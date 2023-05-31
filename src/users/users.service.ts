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

  public async findOneNullable(props: DeepPartial<User>): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      email: props.email
    });
  }

  public async findOne(props: DeepPartial<User>): Promise<User> {
    const user = await this.findOneNullable(props);

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  public async findOneWithProfileNullable(
    props: DeepPartial<User>
  ): Promise<User | null> {
    return await this.usersRepository.findOne({
      relations: {
        profile: true
      },
      where: {
        id: props.id,
        guid: props.guid,
        email: props.email
      }
    });
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
