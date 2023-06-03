import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUniqueId } from '../utils/unique-id-generator';
import { ProfilesService } from './profiles.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateBcryptHash } from '../utils/other-utils';

@Injectable()
export class UsersService {
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

  public async findOneWithProfile(props: DeepPartial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: {
        profile: true
      },
      where: {
        id: props.id,
        guid: props.guid,
        email: props.email
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
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

  public async updateById(
    id: number,
    userProps: DeepPartial<User>
  ): Promise<void> {
    await this.usersRepository.update(
      {
        id
      },
      userProps
    );
  }

  public async updateByEmail(
    email: string,
    props: DeepPartial<User>
  ): Promise<void> {
    await this.usersRepository.update(
      {
        email
      },
      props
    );
  }

  public async updateByIdAndReturn(
    id: number,
    props: UpdateUserDto
  ): Promise<User> {
    if (props.password) {
      props.password = await generateBcryptHash(props.password);
    }

    await this.usersRepository.update(
      {
        id
      },
      {
        password: props.password
      }
    );
    await this.profilesService.updateByUserId(id, props.profile);
    return await this.findOneWithProfile({ id });
  }
}
