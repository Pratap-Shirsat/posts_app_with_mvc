import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
  ) {}

  async getUserById(userId: string): Promise<any> {
    return await this.userModel.findOne({ where: { userId } });
  }

  async createUser(user: User): Promise<any> {
    return await this.userModel.save(user);
  }

  async updateUserDetails(userId: string, user: User): Promise<any> {
    return await this.userModel.update(
      { userId },
      {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    );
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
    newSalt: string,
  ): Promise<any> {
    return await this.userModel.update(
      { userId },
      {
        password: newPassword,
        salt: newSalt,
      },
    );
  }

  async removeUser(userId: string): Promise<any> {
    return await this.userModel.delete(userId);
  }

  async findUserByUsername(username: string): Promise<any> {
    return await this.userModel.findOne({ where: { username } });
  }

  async updateProfileImageDetails(userId: string, profileImage: string) {
    return await this.userModel.update({ userId }, { profileImage });
  }
}
