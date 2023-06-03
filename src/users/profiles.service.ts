import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>
  ) {}

  /**
   * Creates profile entity related to user. userId property is enough for proper reference
   * @param profileProps
   */
  public async create(profileProps: DeepPartial<Profile>): Promise<Profile> {
    return await this.profilesRepository.save({
      firstName: profileProps.firstName,
      lastName: profileProps.lastName,
      country: profileProps.country,
      phone: profileProps.phone,
      user: { id: profileProps.user?.id }
    });
  }

  public async findByIdNullable(id: number): Promise<Profile | null> {
    return await this.profilesRepository.findOneBy({ id });
  }

  public async updateByUserId(
    userId: number,
    props: DeepPartial<Profile>
  ): Promise<void> {
    await this.profilesRepository.update({ user: { id: userId } }, props);
  }
}
